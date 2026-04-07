const express = require('express');
const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'name', 'status', 'sort_order', 'level_id', 'created_date'];

function buildQuery(req) {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sortField) ? req.query.sortField : 'id';
  const sortOrder = req.query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { page, perPage, sortField, sortOrder, filter };
}

function createSectionRouter(categoryId) {
  const router = express.Router();

  // GET /filters - subcategory options (parent_id=0) + levels
  router.get('/filters', async (req, res) => {
    try {
      const subcategories = await sequelize.query(`
        SELECT tc.id, tcl.name
        FROM test_category tc
        LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
        WHERE tc.category_id = :categoryId AND tc.parent_id = 0 AND tc.status = 1
        ORDER BY tc.sort_order ASC, tc.id ASC
      `, { replacements: { categoryId }, type: QueryTypes.SELECT });

      const levels = await sequelize.query(`
        SELECT tl.id, tll.name
        FROM test_level tl
        LEFT JOIN test_level_label tll ON tl.id = tll.test_level_id AND tll.language_id = 1
        WHERE tl.status = 1
        ORDER BY tl.sort_order ASC
      `, { type: QueryTypes.SELECT });

      res.json({ subcategories, levels });
    } catch (error) {
      console.error('Error fetching filters:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // GET / - List test categories for this section
  router.get('/', async (req, res) => {
    try {
      const { page, perPage, sortField, sortOrder, filter } = buildQuery(req);
      const offset = (page - 1) * perPage;

      let where = 'WHERE tc.category_id = :categoryId AND tc.parent_id != 0';
      const replacements = { categoryId };

      if (filter.q) {
        where += ' AND (tcl.name LIKE :search OR tcl.description LIKE :search)';
        replacements.search = `%${filter.q}%`;
      }

      if (filter.ids) {
        const ids = Array.isArray(filter.ids) ? filter.ids : JSON.parse(filter.ids);
        where += ' AND tc.id IN (:ids)';
        replacements.ids = ids;
      }

      if (filter.level_id) {
        where += ' AND tc.level_id = :level_id';
        replacements.level_id = filter.level_id;
      }

      if (filter.parent_id) {
        where += ' AND tc.parent_id = :parent_id';
        replacements.parent_id = filter.parent_id;
      }

      if (filter.english_variant) {
        where += ' AND tc.english_variant = :english_variant';
        replacements.english_variant = filter.english_variant;
      }

      const [countResult] = await sequelize.query(`
        SELECT COUNT(DISTINCT tc.id) as total
        FROM test_category tc
        LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
        ${where}
      `, { replacements, type: QueryTypes.SELECT });

      const sortCol = sortField === 'name' ? 'tcl.name'
        : sortField === 'level_id' ? 'tc.level_id'
        : `tc.${sortField}`;

      const data = await sequelize.query(`
        SELECT tc.id, tc.category_id, tc.parent_id, tc.level_id, tc.status,
               tc.sort_order, tc.time, tc.image, tc.created_date,
               tc.english_variant,
               tcl.name, tcl.description,
               tll.name as level_name,
               pcl.name as parent_name,
               COALESCE(rl.required_level, 0) as required_level,
               (SELECT COUNT(*) FROM test t WHERE t.parent_id = tc.id) as question_count
        FROM test_category tc
        LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
        LEFT JOIN test_level tl ON tc.level_id = tl.id
        LEFT JOIN test_level_label tll ON tl.id = tll.test_level_id AND tll.language_id = 1
        LEFT JOIN test_category ptc ON tc.parent_id = ptc.id
        LEFT JOIN test_category_label pcl ON ptc.id = pcl.test_category_id AND pcl.language_id = 1
        LEFT JOIN (
          SELECT mht.test_id,
            CASE WHEN MAX(m.vip) = 1 THEN 2 ELSE 1 END as required_level
          FROM membership_has_test mht
          JOIN membership m ON mht.membership_id = m.id
          WHERE mht.type = 0 AND m.status = 1
          GROUP BY mht.test_id
        ) rl ON rl.test_id = tc.id
        ${where}
        ORDER BY ${sortCol} ${sortOrder}
        LIMIT :limit OFFSET :offset
      `, {
        replacements: { ...replacements, limit: perPage, offset },
        type: QueryTypes.SELECT
      });

      res.json({ data, total: countResult.total });
    } catch (error) {
      console.error('Error fetching section tests:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // GET /:id - Single test category with questions
  router.get('/:id', async (req, res) => {
    try {
      const [testCategory] = await sequelize.query(`
        SELECT tc.id, tc.category_id, tc.parent_id, tc.level_id, tc.status,
               tc.sort_order, tc.time, tc.image, tc.created_date,
               tc.english_variant,
               tcl.name, tcl.description,
               tll.name as level_name,
               pcl.name as parent_name,
               COALESCE(rl.required_level, 0) as required_level
        FROM test_category tc
        LEFT JOIN test_category_label tcl ON tc.id = tcl.test_category_id AND tcl.language_id = 1
        LEFT JOIN test_level tl ON tc.level_id = tl.id
        LEFT JOIN test_level_label tll ON tl.id = tll.test_level_id AND tll.language_id = 1
        LEFT JOIN test_category ptc ON tc.parent_id = ptc.id
        LEFT JOIN test_category_label pcl ON ptc.id = pcl.test_category_id AND pcl.language_id = 1
        LEFT JOIN (
          SELECT mht.test_id,
            CASE WHEN MAX(m.vip) = 1 THEN 2 ELSE 1 END as required_level
          FROM membership_has_test mht
          JOIN membership m ON mht.membership_id = m.id
          WHERE mht.type = 0 AND m.status = 1
          GROUP BY mht.test_id
        ) rl ON rl.test_id = tc.id
        WHERE tc.id = :id
      `, {
        replacements: { id: req.params.id },
        type: QueryTypes.SELECT
      });

      if (!testCategory) {
        return res.status(404).json({ message: 'Test category not found' });
      }

      // Get questions with answers
      const questions = await sequelize.query(`
        SELECT t.id, t.parent_id as test_category_id, t.status, t.sort_order,
               t.image, t.audio, t.question_type, t.answer_type,
               COALESCE(tl.value, t.question) as question
        FROM test t
        LEFT JOIN test_label tl ON t.id = tl.test_id AND tl.language_id = 1
        WHERE t.parent_id = :testCategoryId
        ORDER BY t.sort_order ASC, t.id ASC
      `, {
        replacements: { testCategoryId: req.params.id },
        type: QueryTypes.SELECT
      });

      for (const q of questions) {
        const answers = await sequelize.query(`
          SELECT ta.id, ta.value as text, ta.true_false
          FROM test_answer ta
          WHERE ta.test_id = :testId
          ORDER BY ta.id ASC
        `, {
          replacements: { testId: q.id },
          type: QueryTypes.SELECT
        });
        q.answers = answers;
      }

      testCategory.questions = questions;
      res.json(testCategory);
    } catch (error) {
      console.error('Error fetching test category:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // POST - Create test category
  router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        name, description, parent_id, level_id,
        status = 1, sort_order = 0, time, image, english_variant,
        required_level
      } = req.body;

      const [result] = await sequelize.query(`
        INSERT INTO test_category (category_id, parent_id, level_id, status, sort_order, time, image, english_variant, created_date)
        VALUES (:category_id, :parent_id, :level_id, :status, :sort_order, :time, :image, :english_variant, NOW())
      `, {
        replacements: {
          category_id: categoryId,
          parent_id: parent_id || 0,
          level_id: level_id || 0,
          status,
          sort_order,
          time: time || '00:10:00',
          image: image || null,
          english_variant: english_variant || 'both'
        },
        type: QueryTypes.INSERT,
        transaction: t
      });

      const newId = result;

      await sequelize.query(`
        INSERT INTO test_category_label (test_category_id, language_id, name, description, seo_name)
        VALUES (:id, 1, :name, :description, :seo_name)
      `, {
        replacements: {
          id: newId,
          name: name || '',
          description: description || '',
          seo_name: (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        },
        type: QueryTypes.INSERT,
        transaction: t
      });

      // Set access level
      if (required_level !== undefined && parseInt(required_level) > 0) {
        const [membership] = await sequelize.query(
          `SELECT id FROM membership WHERE vip = :vip AND status = 1 ORDER BY id ASC LIMIT 1`,
          { replacements: { vip: parseInt(required_level) >= 2 ? 1 : 0 }, type: QueryTypes.SELECT, transaction: t }
        );
        if (membership) {
          await sequelize.query(
            `INSERT INTO membership_has_test (membership_id, test_id, type) VALUES (:membership_id, :test_id, 0)`,
            { replacements: { membership_id: membership.id, test_id: newId }, type: QueryTypes.INSERT, transaction: t }
          );
        }
      }

      await t.commit();
      res.json({ id: newId, name, status, sort_order, required_level: parseInt(required_level) || 0 });
    } catch (error) {
      await t.rollback();
      console.error('Error creating test category:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // PUT - Update test category
  router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        name, description, parent_id, level_id,
        status, sort_order, time, image, english_variant,
        required_level
      } = req.body;
      const id = req.params.id;

      await sequelize.query(`
        UPDATE test_category
        SET parent_id = COALESCE(:parent_id, parent_id),
            level_id = COALESCE(:level_id, level_id),
            status = COALESCE(:status, status),
            sort_order = COALESCE(:sort_order, sort_order),
            time = COALESCE(:time, time),
            image = COALESCE(:image, image),
            english_variant = COALESCE(:english_variant, english_variant)
        WHERE id = :id
      `, {
        replacements: { id, parent_id, level_id, status, sort_order, time, image, english_variant },
        type: QueryTypes.UPDATE,
        transaction: t
      });

      // Update or insert label
      const [existingLabel] = await sequelize.query(
        `SELECT id FROM test_category_label WHERE test_category_id = :id AND language_id = 1`,
        { replacements: { id }, type: QueryTypes.SELECT, transaction: t }
      );

      if (existingLabel) {
        await sequelize.query(`
          UPDATE test_category_label
          SET name = COALESCE(:name, name),
              description = COALESCE(:description, description),
              seo_name = COALESCE(:seo_name, seo_name)
          WHERE test_category_id = :id AND language_id = 1
        `, {
          replacements: {
            id, name, description,
            seo_name: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : null
          },
          type: QueryTypes.UPDATE,
          transaction: t
        });
      } else {
        await sequelize.query(`
          INSERT INTO test_category_label (test_category_id, language_id, name, description, seo_name)
          VALUES (:id, 1, :name, :description, :seo_name)
        `, {
          replacements: {
            id,
            name: name || '',
            description: description || '',
            seo_name: (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          },
          type: QueryTypes.INSERT,
          transaction: t
        });
      }

      // Update access level
      if (required_level !== undefined) {
        await sequelize.query(
          `DELETE FROM membership_has_test WHERE test_id = :id AND type = 0`,
          { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
        );
        if (parseInt(required_level) > 0) {
          const [membership] = await sequelize.query(
            `SELECT id FROM membership WHERE vip = :vip AND status = 1 ORDER BY id ASC LIMIT 1`,
            { replacements: { vip: parseInt(required_level) >= 2 ? 1 : 0 }, type: QueryTypes.SELECT, transaction: t }
          );
          if (membership) {
            await sequelize.query(
              `INSERT INTO membership_has_test (membership_id, test_id, type) VALUES (:membership_id, :test_id, 0)`,
              { replacements: { membership_id: membership.id, test_id: id }, type: QueryTypes.INSERT, transaction: t }
            );
          }
        }
      }

      await t.commit();
      res.json({ id: parseInt(id), name, status, sort_order, required_level: parseInt(required_level) || 0 });
    } catch (error) {
      await t.rollback();
      console.error('Error updating test category:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // DELETE - Delete test category and children
  router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.params.id;

      // Delete answers for all child tests
      await sequelize.query(`
        DELETE ta FROM test_answer ta
        INNER JOIN test t ON ta.test_id = t.id
        WHERE t.parent_id = :id
      `, { replacements: { id }, type: QueryTypes.DELETE, transaction: t });

      // Delete labels for all child tests
      await sequelize.query(`
        DELETE tl FROM test_label tl
        INNER JOIN test t ON tl.test_id = t.id
        WHERE t.parent_id = :id
      `, { replacements: { id }, type: QueryTypes.DELETE, transaction: t });

      // Delete child tests
      await sequelize.query(
        `DELETE FROM test WHERE parent_id = :id`,
        { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
      );

      // Delete membership access entries
      await sequelize.query(
        `DELETE FROM membership_has_test WHERE test_id = :id AND type = 0`,
        { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
      );

      // Delete test category label
      await sequelize.query(
        `DELETE FROM test_category_label WHERE test_category_id = :id`,
        { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
      );

      // Delete test category
      await sequelize.query(
        `DELETE FROM test_category WHERE id = :id`,
        { replacements: { id }, type: QueryTypes.DELETE, transaction: t }
      );

      await t.commit();
      res.json({ id: parseInt(id) });
    } catch (error) {
      await t.rollback();
      console.error('Error deleting test category:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
}

module.exports = {
  audioTestsRouter: createSectionRouter(15),
  synonymTestsRouter: createSectionRouter(19),
  antonymTestsRouter: createSectionRouter(23),
  generalEnglishTestsRouter: createSectionRouter(2),
  professionalEnglishTestsRouter: createSectionRouter(3),
  photoTestsRouter: createSectionRouter(4),
};
