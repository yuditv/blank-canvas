import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileMeta = {
  name?: string;
  avatar_url?: string;
};

export function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const initials = useMemo(() => {
    const n = (name || email || "U").trim();
    return n.slice(0, 1).toUpperCase();
  }, [name, email]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!alive) return;
      if (error || !data.user) {
        setLoading(false);
        return;
      }

      const meta = (data.user.user_metadata ?? {}) as ProfileMeta;
      setUserId(data.user.id);
      setEmail(data.user.email ?? "");
      setName(meta.name ?? "");
      setAvatarUrl(meta.avatar_url ?? "");
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      const meta = (u?.user_metadata ?? {}) as ProfileMeta;
      setUserId(u?.id ?? null);
      setEmail(u?.email ?? "");
      setName(meta.name ?? "");
      setAvatarUrl(meta.avatar_url ?? "");
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          avatar_url: avatarUrl || undefined,
        } satisfies ProfileMeta,
      });
      if (error) throw error;
      toast.success("Conta atualizada");
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    if (!userId) return;

    setSaving(true);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${userId}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type || undefined });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = data.publicUrl;
      setAvatarUrl(url);

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: url } satisfies ProfileMeta,
      });
      if (error) throw error;

      toast.success("Foto atualizada");
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível enviar a foto");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!email) return;
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }

    setSaving(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) throw signInError;

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Senha alterada");
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível mudar a senha");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="h-28 rounded-xl border border-border bg-card/50" />
        <div className="h-44 rounded-xl border border-border bg-card/50" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section className="rounded-xl border border-border bg-card/50 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatarUrl || undefined} alt="Foto do perfil" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="text-lg font-semibold">{name?.trim() ? name : "Minha conta"}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleUploadAvatar(f);
                  e.currentTarget.value = "";
                }}
              />
              <Button type="button" variant="secondary" disabled={!userId || saving}>
                Alterar foto
              </Button>
            </label>

            <Button type="button" onClick={handleSaveProfile} disabled={saving}>
              Salvar
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={email} readOnly />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card/50 p-6">
        <div className="text-base font-semibold">Trocar senha</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button type="button" className="w-full" onClick={handleChangePassword} disabled={saving || !currentPassword}>
            Mudar senha
          </Button>
        </div>
      </section>
    </div>
  );
}
