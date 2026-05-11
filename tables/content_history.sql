CREATE TABLE content_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_url VARCHAR(1000) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    snippet TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    newsletter_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);