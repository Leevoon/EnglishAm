// Initialize all model associations
const Slideshow = require('./Slideshow');
const SlideshowLabel = require('./SlideshowLabel');
const News = require('./News');
const NewsLabel = require('./NewsLabel');
const Review = require('./Review');
const User = require('./User');
const Membership = require('./Membership');
const MembershipLabel = require('./MembershipLabel');

// Set up associations
Slideshow.hasMany(SlideshowLabel, { foreignKey: 'slideshow_id', as: 'slideshowLabels' });
SlideshowLabel.belongsTo(Slideshow, { foreignKey: 'slideshow_id', as: 'slideshow' });

News.hasMany(NewsLabel, { foreignKey: 'news_id', as: 'newsLabels' });
NewsLabel.belongsTo(News, { foreignKey: 'news_id', as: 'news' });

Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

Membership.hasMany(MembershipLabel, { foreignKey: 'membership_id', as: 'membershipLabels' });
MembershipLabel.belongsTo(Membership, { foreignKey: 'membership_id', as: 'membership' });

module.exports = {};



