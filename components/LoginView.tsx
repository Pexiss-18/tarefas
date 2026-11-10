"use client";

import { useState } from "react";
import { authErrorMessage, signIn } from "@/lib/cloud";

/**
 * Entrada no caderno: e-mail e senha do Firebase (a mesma conta do
 * px_financeiro serve). Depois de entrar, o aparelho fica logado.
 */
export default function LoginView() {
  const [create, setCreate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim()) return setError("Escreva o seu e-mail.");
    if (password.length < 6) return setError("A senha precisa de pelo menos 6 caracteres.");
    if (create && password !== confirm) return setError("As duas senhas não batem.");
    setBusy(true);
    try {
      await signIn(email.trim(), password, create);
    } catch (e) {
      setError(authErrorMessage(e));
      setBusy(false);
    }
  };

  return (
    <main className="login">
      <form
        className="paper"
        data-paper="amassada"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="margin-line" aria-hidden />
        <h1>Tarefas</h1>
        <p className="note" style={{ marginTop: 6 }}>
          {create ? "Primeira vez aqui: crie a conta do seu caderno." : "Entre pra abrir o seu caderno."}
        </p>
        <input
          type="email"
          autoFocus
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-mail"
          aria-label="E-mail"
        />
        <input
          type="password"
          autoComplete={create ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="senha"
          aria-label="Senha"
        />
        {create && (
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="repita a senha"
            aria-label="Repita a senha"
          />
        )}
        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}
        <div className="login-actions">
          <button type="submit" className="pill" disabled={busy}>
            {busy ? "abrindo…" : create ? "criar conta e entrar" : "entrar"}
          </button>
          <button
            type="button"
            className="login-switch"
            onClick={() => {
              setCreate(!create);
              setError(null);
            }}
          >
            {create ? "já tenho conta" : "criar conta"}
          </button>
        </div>
      </form>
    </main>
  );
}
