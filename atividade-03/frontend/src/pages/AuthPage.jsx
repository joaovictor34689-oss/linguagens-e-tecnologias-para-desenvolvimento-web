import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, CircleCheck, LockKeyhole } from "lucide-react";
import { api } from "../services/api.js";

export default function AuthPage({ mode, onSuccess }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await api(`/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onSuccess(result);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <Link className="brand brand-light" to="/login" aria-label="Foco, página inicial">
          <span className="brand-icon"><Check size={18} strokeWidth={3} /></span>
          <span>foco<span className="brand-dot">.</span></span>
        </Link>
        <div className="story-copy">
          <span className="eyebrow eyebrow-light">MENOS CORRERIA, MAIS CLAREZA</span>
          <h1>O que importa<br />cabe no seu dia.</h1>
          <p>Organize suas tarefas, acompanhe seu progresso e siga no seu ritmo.</p>
          <div className="story-note">
            <CircleCheck size={19} />
            <span>Um passo de cada vez já é progresso.</span>
          </div>
        </div>
        <span className="story-footer">SEU ESPAÇO DE ORGANIZAÇÃO</span>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <Link className="brand" to="/login">
              <span className="brand-icon"><Check size={18} strokeWidth={3} /></span>
              <span>foco<span className="brand-dot">.</span></span>
            </Link>
          </div>
          <span className="eyebrow">{isRegister ? "COMECE POR AQUI" : "BEM-VINDO DE VOLTA"}</span>
          <h2>{isRegister ? "Crie sua conta" : "Entre na sua conta"}</h2>
          <p className="form-intro">
            {isRegister ? "Seu espaço para tirar as tarefas da cabeça." : "Acesse seu espaço e continue de onde parou."}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="field">
                <span>Nome</span>
                <input
                  autoComplete="name"
                  maxLength="80"
                  name="name"
                  onChange={updateField}
                  placeholder="Como podemos chamar você?"
                  required
                  value={form.name}
                />
              </label>
            )}
            <label className="field">
              <span>E-mail</span>
              <input
                autoComplete="email"
                maxLength="254"
                name="email"
                onChange={updateField}
                placeholder="voce@email.com"
                required
                type="email"
                value={form.email}
              />
            </label>
            <label className="field">
              <span>Senha</span>
              <input
                autoComplete={isRegister ? "new-password" : "current-password"}
                maxLength="128"
                minLength={isRegister ? "8" : undefined}
                name="password"
                onChange={updateField}
                placeholder={isRegister ? "Pelo menos 8 caracteres" : "Sua senha"}
                required
                type="password"
                value={form.password}
              />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="button button-primary auth-submit" disabled={submitting} type="submit">
              {submitting ? "Aguarde..." : isRegister ? "Criar conta" : "Entrar"}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            <span>{isRegister ? "Já tem uma conta?" : "Ainda não tem uma conta?"}</span>
            <Link to={isRegister ? "/login" : "/cadastro"}>{isRegister ? "Entrar" : "Criar conta"}</Link>
          </div>
          <div className="secure-note"><LockKeyhole size={14} /> Seus dados são protegidos com segurança.</div>
        </div>
      </section>
    </main>
  );
}
