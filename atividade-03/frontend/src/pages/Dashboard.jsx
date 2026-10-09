import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, CheckCheck, Circle, CircleCheck, Clock3, LogOut, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import TaskForm from "../components/TaskForm.jsx";
import { api } from "../services/api.js";

export default function Dashboard({ token, user, onSignOut }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("todas");
  const [query, setQuery] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadTasks = useCallback(async () => {
    setError("");
    try {
      const result = await api("/tasks", { token });
      setTasks(result.tasks);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const completedCount = useMemo(() => tasks.filter((task) => task.status === "concluída").length, [tasks]);
  const pendingCount = tasks.length - completedCount;
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesStatus = filter === "todas" || task.status === filter;
      const matchesQuery = !normalizedQuery
        || task.title.toLowerCase().includes(normalizedQuery)
        || task.description.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [filter, query, tasks]);

  function openNewTask() {
    setActiveTask(null);
    setFormOpen(true);
  }

  function openEditTask(task) {
    setActiveTask(task);
    setFormOpen(true);
  }

  async function saveTask(values) {
    setSaving(true);
    setError("");
    try {
      if (activeTask) {
        const result = await api(`/tasks/${activeTask._id}`, {
          method: "PUT",
          token,
          body: JSON.stringify(values),
        });
        setTasks((current) => current.map((task) => task._id === result.task._id ? result.task : task));
        setToast("Tarefa atualizada.");
      } else {
        const result = await api("/tasks", {
          method: "POST",
          token,
          body: JSON.stringify(values),
        });
        setTasks((current) => [result.task, ...current]);
        setToast("Tarefa criada.");
      }
      setFormOpen(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task) {
    const nextStatus = task.status === "concluída" ? "pendente" : "concluída";
    try {
      const result = await api(`/tasks/${task._id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ status: nextStatus }),
      });
      setTasks((current) => current.map((item) => item._id === result.task._id ? result.task : item));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeTask(task) {
    if (!window.confirm(`Excluir a tarefa “${task.title}”?`)) return;
    try {
      await api(`/tasks/${task._id}`, { method: "DELETE", token });
      setTasks((current) => current.filter((item) => item._id !== task._id));
      setToast("Tarefa excluída.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Foco, início">
          <span className="brand-icon"><Check size={18} strokeWidth={3} /></span>
          <span>foco<span className="brand-dot">.</span></span>
        </a>
        <div className="sidebar-section">
          <span className="sidebar-label">ESPAÇO PESSOAL</span>
          <div className="sidebar-link sidebar-link-active"><CircleCheck size={17} /> Minhas tarefas</div>
        </div>
        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">{user.name.trim().charAt(0).toUpperCase()}</div>
            <div className="profile-copy">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={onSignOut} type="button">
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <span className="breadcrumb">Seu espaço <span>/</span> Minhas tarefas</span>
          <span className="today-label">{today}</span>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <span className="eyebrow">SEU DIA, DO SEU JEITO</span>
              <h1>Olá, {user.name.split(" ")[0]}<span className="heading-dot">.</span></h1>
              <p>Um passo de cada vez já é progresso.</p>
            </div>
            <button className="button button-primary add-task-button" onClick={openNewTask} type="button">
              <Plus size={18} /> Nova tarefa
            </button>
          </section>

          <section aria-label="Resumo das tarefas" className="summary-grid">
            <article className="summary-card">
              <div className="summary-top"><span>Tarefas no total</span><span className="summary-icon summary-icon-ink"><CheckCheck size={17} /></span></div>
              <strong>{tasks.length.toString().padStart(2, "0")}</strong>
              <span className="summary-foot">na sua lista</span>
            </article>
            <article className="summary-card">
              <div className="summary-top"><span>Em andamento</span><span className="summary-icon summary-icon-amber"><Clock3 size={17} /></span></div>
              <strong>{pendingCount.toString().padStart(2, "0")}</strong>
              <span className="summary-foot">prontas para avançar</span>
            </article>
            <article className="summary-card">
              <div className="summary-top"><span>Concluídas</span><span className="summary-icon summary-icon-green"><CircleCheck size={17} /></span></div>
              <strong>{completedCount.toString().padStart(2, "0")}</strong>
              <span className="summary-foot">bom trabalho até aqui</span>
            </article>
          </section>

          <section className="tasks-section">
            <div className="tasks-heading">
              <div>
                <span className="eyebrow">ORGANIZE O QUE VEM A SEGUIR</span>
                <h2>Sua lista</h2>
              </div>
              <label className="search-box">
                <Search size={16} />
                <input aria-label="Buscar tarefas" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tarefa" value={query} />
              </label>
            </div>

            <div className="task-filters" aria-label="Filtrar tarefas">
              {[
                ["todas", "Todas", tasks.length],
                ["pendente", "Pendentes", pendingCount],
                ["concluída", "Concluídas", completedCount],
              ].map(([value, label, count]) => (
                <button
                  aria-pressed={filter === value}
                  className={`filter-button ${filter === value ? "filter-button-active" : ""}`}
                  key={value}
                  onClick={() => setFilter(value)}
                  type="button"
                >
                  {label}<span>{count}</span>
                </button>
              ))}
            </div>

            {error && <div className="inline-error" role="alert">{error}</div>}
            {loading ? (
              <div className="loading-tasks">Carregando suas tarefas...</div>
            ) : visibleTasks.length > 0 ? (
              <div className="task-list">
                {visibleTasks.map((task) => {
                  const done = task.status === "concluída";
                  return (
                    <article className={`task-card ${done ? "task-card-done" : ""}`} key={task._id}>
                      <button
                        aria-label={done ? `Reabrir ${task.title}` : `Concluir ${task.title}`}
                        className={`task-check ${done ? "task-check-done" : ""}`}
                        onClick={() => toggleTask(task)}
                        type="button"
                      >
                        {done ? <Check size={15} strokeWidth={3} /> : <Circle size={20} strokeWidth={1.6} />}
                      </button>
                      <div className="task-copy">
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                      </div>
                      <span className={`task-status ${done ? "task-status-done" : ""}`}>
                        {done ? "Concluída" : "Pendente"}
                      </span>
                      <div className="task-actions">
                        <button aria-label={`Editar ${task.title}`} className="icon-button" onClick={() => openEditTask(task)} type="button"><SquarePen size={17} /></button>
                        <button aria-label={`Excluir ${task.title}`} className="icon-button icon-button-danger" onClick={() => removeTask(task)} type="button"><Trash2 size={17} /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><CircleCheck size={24} /></span>
                <h3>{query ? "Nenhuma tarefa encontrada" : tasks.length === 0 ? "Sua lista começa aqui" : "Nada por aqui"}</h3>
                <p>{query ? "Tente outro termo ou altere o filtro." : tasks.length === 0 ? "Adicione a primeira tarefa para organizar o seu dia." : "Não há tarefas neste filtro."}</p>
                {!query && tasks.length === 0 && (
                  <button className="button button-secondary" onClick={openNewTask} type="button"><Plus size={17} /> Criar primeira tarefa</button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {formOpen && (
        <TaskForm
          key={activeTask?._id || "new"}
          error={error}
          onClose={() => setFormOpen(false)}
          onSave={saveTask}
          saving={saving}
          task={activeTask}
        />
      )}
      {toast && <div className="toast" role="status"><CircleCheck size={17} />{toast}</div>}
    </div>
  );
}
