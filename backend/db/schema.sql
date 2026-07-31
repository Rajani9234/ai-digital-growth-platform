-- ============================================================
-- JhaTech Solutions — MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS jhatech_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jhatech_db;

-- ── 1. Pain Point Form Submissions ──────────────────────────
CREATE TABLE IF NOT EXISTS pain_analysis (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  business_name    VARCHAR(200)  NOT NULL,
  business_type    VARCHAR(200)  NOT NULL,
  city             VARCHAR(100)  NOT NULL,
  monthly_revenue  VARCHAR(50)   DEFAULT NULL,
  challenges       JSON          NOT NULL,         -- array of challenge ids
  online_presence  VARCHAR(50)   DEFAULT 'none',
  target_audience  VARCHAR(200)  DEFAULT NULL,
  budget           VARCHAR(50)   NOT NULL,
  additional_info  TEXT          DEFAULT NULL,
  ai_report        LONGTEXT      DEFAULT NULL,     -- full JSON report from Gemini
  digital_score    INT           DEFAULT 0,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── 2. Referral Partners ────────────────────────────────────
CREATE TABLE IF NOT EXISTS referral_partners (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  full_name        VARCHAR(200)  NOT NULL,
  phone            VARCHAR(15)   NOT NULL UNIQUE,
  email            VARCHAR(200)  DEFAULT NULL,
  city             VARCHAR(100)  NOT NULL,
  referral_code    VARCHAR(20)   NOT NULL UNIQUE,
  total_referrals  INT           DEFAULT 0,
  total_earnings   DECIMAL(10,2) DEFAULT 0.00,
  status           ENUM('active','inactive') DEFAULT 'active',
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── 3. Referral Conversions (successful sales) ──────────────
CREATE TABLE IF NOT EXISTS referral_conversions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  partner_id       INT           NOT NULL,
  client_name      VARCHAR(200)  NOT NULL,
  client_phone     VARCHAR(15)   NOT NULL,
  package_name     VARCHAR(200)  NOT NULL,
  package_amount   DECIMAL(10,2) NOT NULL,
  commission       DECIMAL(10,2) DEFAULT 1000.00,
  status           ENUM('pending','confirmed','paid') DEFAULT 'pending',
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES referral_partners(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 4. Contact / Enquiries ───────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(200)  NOT NULL,
  phone            VARCHAR(15)   NOT NULL,
  email            VARCHAR(200)  DEFAULT NULL,
  business_type    VARCHAR(200)  DEFAULT NULL,
  message          TEXT          NOT NULL,
  source           VARCHAR(50)   DEFAULT 'contact_form',  -- contact_form | whatsapp | pricing
  plan_interest    VARCHAR(200)  DEFAULT NULL,
  status           ENUM('new','contacted','converted') DEFAULT 'new',
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_pain_city        ON pain_analysis(city);
CREATE INDEX idx_partner_phone    ON referral_partners(phone);
CREATE INDEX idx_partner_code     ON referral_partners(referral_code);
CREATE INDEX idx_enquiry_status   ON enquiries(status);
