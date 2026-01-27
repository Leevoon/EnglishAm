const sequelize = require('../config/database');
const Category = require('./Category');
const CategoryLabel = require('./CategoryLabel');
const TestCategory = require('./TestCategory');
const TestCategoryLabel = require('./TestCategoryLabel');
const TestLevel = require('./TestLevel');
const TestLevelLabel = require('./TestLevelLabel');
const Test = require('./Test');
const TestAnswer = require('./TestAnswer');
const TestLabel = require('./TestLabel');
const Language = require('./Language');
const User = require('./User');
const Slideshow = require('./Slideshow');
const SlideshowLabel = require('./SlideshowLabel');
const News = require('./News');
const NewsLabel = require('./NewsLabel');
const Review = require('./Review');
const Membership = require('./Membership');
const MembershipLabel = require('./MembershipLabel');
const Gallery = require('./Gallery');

// Define existing associations
Category.hasMany(CategoryLabel, { foreignKey: 'category_id', as: 'labels' });
CategoryLabel.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

TestCategory.hasMany(TestCategoryLabel, { foreignKey: 'test_category_id', as: 'labels' });
TestCategoryLabel.belongsTo(TestCategory, { foreignKey: 'test_category_id', as: 'testCategory' });
TestCategory.hasMany(TestCategory, { foreignKey: 'parent_id', as: 'children' });
TestCategory.belongsTo(TestCategory, { foreignKey: 'parent_id', as: 'parent' });

TestLevel.hasMany(TestLevelLabel, { foreignKey: 'test_level_id', as: 'labels' });
TestLevelLabel.belongsTo(TestLevel, { foreignKey: 'test_level_id', as: 'testLevel' });

Test.hasMany(TestAnswer, { foreignKey: 'test_id', as: 'answers' });
TestAnswer.belongsTo(Test, { foreignKey: 'test_id', as: 'test' });
Test.hasMany(TestLabel, { foreignKey: 'test_id', as: 'labels' });
TestLabel.belongsTo(Test, { foreignKey: 'test_id', as: 'test' });

Language.hasMany(CategoryLabel, { foreignKey: 'language_id' });
Language.hasMany(TestCategoryLabel, { foreignKey: 'language_id' });
Language.hasMany(TestLevelLabel, { foreignKey: 'language_id' });
Language.hasMany(TestLabel, { foreignKey: 'language_id' });

// New associations
Slideshow.hasMany(SlideshowLabel, { foreignKey: 'slideshow_id', as: 'slideshowLabels' });
SlideshowLabel.belongsTo(Slideshow, { foreignKey: 'slideshow_id', as: 'slideshow' });

News.hasMany(NewsLabel, { foreignKey: 'news_id', as: 'newsLabels' });
NewsLabel.belongsTo(News, { foreignKey: 'news_id', as: 'news' });

Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

Membership.hasMany(MembershipLabel, { foreignKey: 'membership_id', as: 'membershipLabels' });
MembershipLabel.belongsTo(Membership, { foreignKey: 'membership_id', as: 'membership' });

Language.hasMany(SlideshowLabel, { foreignKey: 'language_id' });
Language.hasMany(NewsLabel, { foreignKey: 'language_id' });
Language.hasMany(MembershipLabel, { foreignKey: 'language_id' });

module.exports = {
  sequelize,
  Category,
  CategoryLabel,
  TestCategory,
  TestCategoryLabel,
  TestLevel,
  TestLevelLabel,
  Test,
  TestAnswer,
  TestLabel,
  Language,
  User,
  Slideshow,
  SlideshowLabel,
  News,
  NewsLabel,
  Review,
  Membership,
  MembershipLabel,
  Gallery
};