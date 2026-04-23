-- Migration: CV templates admin page
-- Stores the CV templates that users can pick from.

CREATE TABLE IF NOT EXISTS `cv_templates` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cv_name` VARCHAR(255) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `cv_templates` (`id`, `status`, `sort_order`, `created_date`, `cv_name`) VALUES
  (5,  1, 0, '2017-04-04 12:06:05', 'Template 1'),
  (6,  1, 0, '2017-04-05 09:48:27', 'Template 2'),
  (7,  1, 0, '2017-04-05 09:48:34', 'Template 3'),
  (8,  1, 0, '2017-04-05 09:48:40', 'Template 4'),
  (9,  1, 0, '2017-04-05 09:48:50', 'Template 5'),
  (10, 1, 0, '2017-04-21 15:53:18', 'Template 6'),
  (11, 1, 0, '2017-04-21 16:06:51', 'Template 7'),
  (12, 1, 0, '2017-04-21 16:13:25', 'Template 8'),
  (13, 1, 0, '2017-04-21 16:17:07', 'Template 9'),
  (14, 1, 0, '2017-04-21 16:44:53', 'Template 10'),
  (15, 1, 0, '2017-04-21 16:53:55', 'Template 11'),
  (16, 1, 0, '2017-04-21 16:54:23', 'Template 12');
