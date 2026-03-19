const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// Type mapping for membership_has_test.type field
const CONTENT_TYPE_MAP = {
  'test': 0,
  'toefl_reading': 1,
  'toefl_listening': 2,
  'toefl_speaking': 3,
  'toefl_writing': 4,
  'ielts_reading': 5,
  'ielts_listening': 6,
  'ielts_speaking': 7,
  'ielts_writing': 8
};

// Get the user's highest membership level (0 = free/none)
async function getUserMembershipLevel(userId) {
  if (!userId) return 0;

  const [result] = await sequelize.query(`
    SELECT MAX(m.level) as max_level
    FROM user_has_membership uhm
    JOIN membership m ON uhm.membership_id = m.id
    WHERE uhm.user_id = :userId AND m.status = 1
  `, {
    replacements: { userId },
    type: QueryTypes.SELECT
  });

  return result?.max_level || 0;
}

// Get the minimum membership level required to access a specific content item
// Returns 0 if item is not restricted (free access)
async function getRequiredLevel(testId, contentType) {
  const typeCode = CONTENT_TYPE_MAP[contentType];
  if (typeCode === undefined) return 0;

  const [result] = await sequelize.query(`
    SELECT MIN(m.level) as min_level
    FROM membership_has_test mht
    JOIN membership m ON mht.membership_id = m.id
    WHERE mht.test_id = :testId AND mht.type = :typeCode AND m.status = 1
  `, {
    replacements: { testId, typeCode },
    type: QueryTypes.SELECT
  });

  return result?.min_level || 0;
}

// Check if user can access a content item
async function canAccess(userId, testId, contentType) {
  const requiredLevel = await getRequiredLevel(testId, contentType);
  if (requiredLevel === 0) return true; // Free content

  const userLevel = await getUserMembershipLevel(userId);
  return userLevel >= requiredLevel;
}

// Middleware factory: check membership before allowing access to content
function requireMembership(contentType) {
  return async (req, res, next) => {
    try {
      const testId = req.params.id;
      const userId = req.userId || null;

      const requiredLevel = await getRequiredLevel(testId, contentType);
      if (requiredLevel === 0) return next(); // Free content

      if (!userId) {
        return res.status(403).json({
          error: 'Membership required',
          required_level: requiredLevel,
          message: 'Please login and upgrade your membership to access this content'
        });
      }

      const userLevel = await getUserMembershipLevel(userId);
      if (userLevel < requiredLevel) {
        return res.status(403).json({
          error: 'Membership required',
          required_level: requiredLevel,
          user_level: userLevel,
          message: 'Your membership level is not sufficient to access this content'
        });
      }

      next();
    } catch (error) {
      console.error('Membership check error:', error);
      next(); // Fail open - don't block on errors
    }
  };
}

// Annotate a list of items with access info (locked/unlocked, required level)
async function annotateListWithAccess(items, contentType, userId) {
  const typeCode = CONTENT_TYPE_MAP[contentType];
  if (typeCode === undefined) return items;

  const userLevel = await getUserMembershipLevel(userId);

  // Get all restrictions for this content type
  const restrictions = await sequelize.query(`
    SELECT mht.test_id, MIN(m.level) as required_level
    FROM membership_has_test mht
    JOIN membership m ON mht.membership_id = m.id
    WHERE mht.type = :typeCode AND m.status = 1
    GROUP BY mht.test_id
  `, {
    replacements: { typeCode },
    type: QueryTypes.SELECT
  });

  const restrictionMap = {};
  for (const r of restrictions) {
    restrictionMap[r.test_id] = r.required_level;
  }

  return items.map(item => ({
    ...item,
    required_level: restrictionMap[item.id] || 0,
    locked: (restrictionMap[item.id] || 0) > userLevel
  }));
}

module.exports = {
  CONTENT_TYPE_MAP,
  getUserMembershipLevel,
  getRequiredLevel,
  canAccess,
  requireMembership,
  annotateListWithAccess
};
