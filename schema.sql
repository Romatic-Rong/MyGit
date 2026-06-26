-- AI Flashcards 数据库表

-- 知识点卡片表
CREATE TABLE IF NOT EXISTS cards (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  user_id     UUID NOT NULL,
  topic       TEXT NOT NULL,
  title       TEXT NOT NULL,
  explanation TEXT NOT NULL,
  mnemonic    TEXT,
  related     TEXT[] DEFAULT '{}',
  difficulty  TEXT DEFAULT 'beginner',
  tags        TEXT[] DEFAULT '{}',
  favorite    BOOLEAN DEFAULT FALSE,
  review_count INTEGER DEFAULT 0
);

-- 索引：按用户查询
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_favorite ON cards(favorite);
CREATE INDEX IF NOT EXISTS idx_cards_created ON cards(created_at);
