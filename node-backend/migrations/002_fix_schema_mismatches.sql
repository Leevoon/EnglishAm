-- Migration 002: Fix schema mismatches between DB and admin routes
-- OPTIONAL: The admin panel works without this migration.
-- Running this migration adds the 'level' column for more granular membership control.
-- Run this against the live database.

-- 1. Add 'level' column to membership table
--    After applying, routes can use m.level instead of deriving from m.vip
ALTER TABLE membership ADD COLUMN IF NOT EXISTS `level` INT NOT NULL DEFAULT 0
  COMMENT '0=free, 1=silver, 2=gold';

-- Set levels for existing membership plans based on data:
-- id=3 is bronze/free (sort_ortder=1), id=1 is silver (sort_ortder=2), id=2 is gold/vip (sort_ortder=3)
UPDATE membership SET level = 0 WHERE id = 3;
UPDATE membership SET level = 1 WHERE id = 1;
UPDATE membership SET level = 2 WHERE id = 2;

-- 2. Fix ielts_listening_question_answer FK column name typo
--    Original DB has 'ielts_reading_question_id' but it should be 'ielts_listening_question_id'
--    The routes currently work with the typo (using ielts_reading_question_id)
--    Uncomment below to fix the column name (requires MySQL 8.0+):
-- ALTER TABLE ielts_listening_question_answer RENAME COLUMN `ielts_reading_question_id` TO `ielts_listening_question_id`;
