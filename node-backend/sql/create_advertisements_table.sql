-- Create advertisements table for test ads
CREATE TABLE IF NOT EXISTS `advertisements` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `test_id` INT(11) UNSIGNED DEFAULT NULL,
  `ad_type` TINYINT(1) NOT NULL COMMENT '1=video, 2=image, 3=text',
  `content` TEXT,
  `video_url` VARCHAR(255),
  `image_url` VARCHAR(255),
  `status` TINYINT(1) NOT NULL DEFAULT '1',
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_id` (`test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Add english_variant column to test_category table if it doesn't exist
ALTER TABLE `test_category` 
ADD COLUMN IF NOT EXISTS `english_variant` ENUM('american', 'british', 'both') DEFAULT 'both' AFTER `level_id`,
ADD COLUMN IF NOT EXISTS `level_id` INT(11) UNSIGNED DEFAULT NULL AFTER `image`;



