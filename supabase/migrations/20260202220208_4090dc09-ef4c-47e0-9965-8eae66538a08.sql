-- Tabela para solicitações de painel de revenda
CREATE TABLE IF NOT EXISTS public.reseller_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  domain TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  admin_username TEXT NOT NULL,
  admin_password TEXT NOT NULL,
  monthly_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reseller_requests_user_id ON public.reseller_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_reseller_requests_status ON public.reseller_requests(status);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_reseller_requests_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_reseller_requests_updated_at ON public.reseller_requests;
CREATE TRIGGER trigger_update_reseller_requests_updated_at
  BEFORE UPDATE ON public.reseller_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reseller_requests_updated_at();

-- RLS
ALTER TABLE public.reseller_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reseller requests" ON public.reseller_requests;
CREATE POLICY "Users can view own reseller requests"
  ON public.reseller_requests
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reseller requests" ON public.reseller_requests;
CREATE POLICY "Users can insert own reseller requests"
  ON public.reseller_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);