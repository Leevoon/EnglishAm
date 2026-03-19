-- Migration: Add membership levels and test history tracking
-- Run this against the database before starting the updated backend

-- 1. Add hierarchy level to membership table
ALTER TABLE membership ADD COLUMN `level` INT NOT NULL DEFAULT 0
  COMMENT '0=free, 1=silver, 2=gold';

-- Set levels for existing rows
UPDATE membership SET level = 0 WHERE id = 3;  -- free (sort_order=1)
UPDATE membership SET level = 1 WHERE id = 1;  -- silver (sort_order=2)
UPDATE membership SET level = 2 WHERE id = 2;  -- gold (sort_order=3, vip=1)

-- 2. Modify user_history for TOEFL/IELTS tracking
-- Drop FK that constrains test_id to test_category only
ALTER TABLE user_history DROP FOREIGN KEY user_history_ibfk_2;

-- Add type and section columns
ALTER TABLE user_history ADD COLUMN test_type VARCHAR(32) NOT NULL DEFAULT 'regular' AFTER test_id;
ALTER TABLE user_history ADD COLUMN section VARCHAR(32) DEFAULT NULL AFTER test_type;
