import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function TaskForm({ task, error, onClose, onSave, saving }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "pendente");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    onSave({ title, description, status });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="task-modal-title" aria-modal="true" className="task-modal" role="dialog">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{task ? "ATUALIZE OS DETALHES" : "TIRE DA CABEÇA"}</span>
            <h2 id="task-modal-title">{task ? "Editar tarefa" : "Nova tarefa"}</h2>
          </div>
          <button aria-label="Fechar" className="icon-button" onClick={onClose} type="button"><X size={20} /></button>
        </div>
        <form className="task-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Título</span>
            <input autoFocus maxLength="120" onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Preparar apresentação" required value={title} />
          </label>
          <label className="field">
            <span>Descrição <span className="field-optional">opcional</span></span>
            <textarea maxLength="1000" onChange={(event) => setDescription(event.target.value)} placeholder="Adicione mais detalhes, se precisar." rows="4" value={description} />
          </label>
          <label className="field">
            <span>Status</span>
            <select onChange={(event) => setStatus(event.target.value)} value={status}>
              <option value="pendente">Pendente</option>
              <option value="concluída">Concluída</option>
            </select>
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button className="button button-quiet" onClick={onClose} type="button">Cancelar</button>
            <button className="button button-primary" disabled={saving} type="submit">
              {saving ? "Salvando..." : task ? "Salvar alterações" : "Criar tarefa"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
