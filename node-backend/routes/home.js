const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
// Import from models/index to ensure associations are set up
const { 
  Slideshow, 
  SlideshowLabel, 
  News, 
  NewsLabel, 
  Review, 
  Membership, 
  MembershipLabel, 
  Gallery,
  User
} = require('../models');

const DEFAULT_LANGUAGE_ID = 1;

// Get slideshow
router.get('/slideshow', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    
    const slideshows = await Slideshow.findAll({
      where: { status: 1 },
      include: [{
        model: SlideshowLabel,
        as: 'slideshowLabels',
        where: { language_id: languageId },
        required: false,
        attributes: ['value']
      }],
      order: [['sort_order', 'ASC']]
    });

    res.json(slideshows);
  } catch (error) {
    console.error('Error fetching slideshow:', error);
    res.status(500).json({ error: 'Failed to fetch slideshow' });
  }
});

// Get about section content (already exists in content route, but keeping for consistency)
router.get('/about', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const [results] = await sequelize.query(`
      SELECT sp.*, spl.title, spl.value 
      FROM static_pages sp
      LEFT JOIN static_pages_label spl ON sp.id = spl.static_pages_id AND spl.language_id = ${languageId}
      WHERE sp.page_key = 'about_us'
      LIMIT 1
    `);
    res.json(results[0] || null);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ error: 'Failed to fetch about content' });
  }
});

// Get why choose us content
router.get('/why-choose', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const [results] = await sequelize.query(`
      SELECT sp.*, spl.title, spl.value 
      FROM static_pages sp
      LEFT JOIN static_pages_label spl ON sp.id = spl.static_pages_id AND spl.language_id = ${languageId}
      WHERE sp.page_key = 'why'
      LIMIT 1
    `);
    res.json(results[0] || null);
  } catch (error) {
    console.error('Error fetching why choose content:', error);
    res.status(500).json({ error: 'Failed to fetch why choose content' });
  }
});

// Get membership plans
router.get('/memberships', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    
    const memberships = await Membership.findAll({
      where: { status: 1 },
      include: [{
        model: MembershipLabel,
        as: 'membershipLabels',
        where: { language_id: languageId },
        required: false,
        attributes: ['title', 'short_description', 'description']
      }],
      order: [['sort_ortder', 'ASC']]
    });

    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
  }
});

// Get testimonials/reviews
router.get('/testimonials', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const reviews = await Review.findAll({
      where: { status: 1 },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'avatar'],
        where: { block: 0 },
        required: true
      }],
      order: [['id', 'DESC']],
      limit: limit
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Get latest news
router.get('/news', async (req, res) => {
  try {
    const languageId = req.query.languageId || DEFAULT_LANGUAGE_ID;
    const limit = parseInt(req.query.limit) || 3;
    
    const news = await News.findAll({
      where: { status: 1 },
      include: [{
        model: NewsLabel,
        as: 'newsLabels',
        where: { language_id: languageId },
        required: false,
        attributes: ['title', 'value']
      }],
      order: [['created_date', 'DESC']],
      limit: limit
    });

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get gallery images
router.get('/gallery', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const gallery = await Gallery.findAll({
      where: { status: 1 },
      order: [['created_date', 'DESC']],
      limit: limit
    });

    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Get page images
router.get('/page-images', async (req, res) => {
  try {
    const keys = req.query.keys ? req.query.keys.split(',') : ['home_page_review', 'home_page_about_us', 'home_page_why_section', 'home_page_why_section_girl'];
    
    const [results] = await sequelize.query(`
      SELECT \`key\`, image 
      FROM page_images 
      WHERE \`key\` IN (:keys)
    `, {
      replacements: { keys }
    });

    // Convert array to object keyed by 'key' for easier lookup
    const pageImages = {};
    results.forEach(row => {
      pageImages[row.key] = row.image;
    });

    res.json(pageImages);
  } catch (error) {
    console.error('Error fetching page images:', error);
    res.status(500).json({ error: 'Failed to fetch page images' });
  }
});

// Resolved list of categories pinned to the home page.
// source_type=category   → joins category_label
// source_type=lessons_filter → joins lessons_filters_label (+ seo_name for URL)
router.get('/categories', async (req, res) => {
  try {
    const languageId = parseInt(req.query.languageId) || DEFAULT_LANGUAGE_ID;

    const [rows] = await sequelize.query(`
      SELECT
        h.id,
        h.source_type,
        h.source_id,
        h.icon,
        h.color,
        h.description,
        h.sort_order,
        CASE h.source_type
          WHEN 'category'       THEN cl.value
          WHEN 'lessons_filter' THEN lfl.name
        END AS title,
        CASE h.source_type
          WHEN 'lessons_filter' THEN lfl.seo_name
          ELSE NULL
        END AS seo_name
      FROM home_page_categories h
      LEFT JOIN category_label cl
        ON h.source_type = 'category'
       AND cl.category_id = h.source_id
       AND cl.language_id = :lang
      LEFT JOIN lessons_filters_label lfl
        ON h.source_type = 'lessons_filter'
       AND lfl.lessons_filters_id = h.source_id
       AND lfl.language_id = :lang
      WHERE h.status = 1
      ORDER BY h.sort_order ASC, h.id ASC
    `, { replacements: { lang: languageId } });

    res.json(rows);
  } catch (error) {
    console.error('Error fetching home categories:', error);
    res.status(500).json({ error: 'Failed to fetch home categories' });
  }
});

module.exports = router;
