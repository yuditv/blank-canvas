-- Tabela para armazenar pagamentos PIX do Mercado Pago
CREATE TABLE IF NOT EXISTS public.mercado_pago_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount_brl NUMERIC(10,2) NOT NULL,
  payment_id TEXT,
  qr_code TEXT,
  qr_code_base64 TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  external_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index para buscar pagamentos do usuário
CREATE INDEX IF NOT EXISTS idx_mp_payments_user_id ON public.mercado_pago_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_mp_payments_payment_id ON public.mercado_pago_payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_mp_payments_status ON public.mercado_pago_payments(status);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_mp_payments_updated_at()
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

DROP TRIGGER IF EXISTS trigger_update_mp_payments_updated_at ON public.mercado_pago_payments;
CREATE TRIGGER trigger_update_mp_payments_updated_at
  BEFORE UPDATE ON public.mercado_pago_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mp_payments_updated_at();

-- RLS
ALTER TABLE public.mercado_pago_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own MP payments" ON public.mercado_pago_payments;
CREATE POLICY "Users can view own MP payments"
  ON public.mercado_pago_payments
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own MP payments" ON public.mercado_pago_payments;
CREATE POLICY "Users can insert own MP payments"
  ON public.mercado_pago_payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);