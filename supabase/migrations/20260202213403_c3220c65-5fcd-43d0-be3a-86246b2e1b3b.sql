-- Add instaluxo_api_key column to pricing_settings
ALTER TABLE public.pricing_settings
ADD COLUMN IF NOT EXISTS instaluxo_api_key TEXT;