-- Migration: "Choose Home Page Categories" admin page
-- Extends the legacy `choose_your_category` concept so both `category` rows
-- and `lessons_filters` rows (e.g. NewWords) can be pinned to the home page.

CREATE TABLE IF NOT EXISTS `home_page_categories` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `source_type` ENUM('category','lessons_filter') NOT NULL,
  `source_id` INT(11) UNSIGNED NOT NULL,
  `icon` VARCHAR(32) DEFAULT NULL,
  `color` VARCHAR(16) DEFAULT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `source_lookup` (`source_type`, `source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Seed with the items the home page currently shows hardcoded (CategoryCards.js).
-- lessons_filters ids: 5=NewWords, 8=ElementaryDialogs, 7=PictureDictionary
INSERT INTO `home_page_categories`
  (`source_type`, `source_id`, `icon`, `color`, `description`, `sort_order`, `status`)
VALUES
  ('lessons_filter', 5, '📚', '#4CAF50', 'Expand your vocabulary with our comprehensive word lists', 1, 1),
  ('lessons_filter', 8, '💬', '#2196F3', 'Practice real-life conversations and improve speaking',   2, 1),
  ('lessons_filter', 7, '🖼️', '#FF9800', 'Learn words through visual associations',                 3, 1);
