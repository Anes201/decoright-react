-- Add localization fields to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS title_ar TEXT,
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS location_ar TEXT,
ADD COLUMN IF NOT EXISTS location_fr TEXT;

-- Add localization fields to gallery_items table
ALTER TABLE gallery_items 
ADD COLUMN IF NOT EXISTS title_ar TEXT,
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT;

-- Add localization fields to faqs table
-- Note: Assuming table exists based on AdminService usage, if not this will create it or fail if structure differs significantly
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE faqs 
ADD COLUMN IF NOT EXISTS question_ar TEXT,
ADD COLUMN IF NOT EXISTS question_fr TEXT,
ADD COLUMN IF NOT EXISTS answer_ar TEXT,
ADD COLUMN IF NOT EXISTS answer_fr TEXT;
