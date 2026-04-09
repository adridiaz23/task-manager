export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Marcar tarea: ${task.text}`}
      />
      <span className="task-text">{task.text}</span>
      <button
        className="btn-delete"
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Eliminar tarea: ${task.text}`}
        title="Eliminar"
      >
        ✕
      </button>
    </li>
  )
}
