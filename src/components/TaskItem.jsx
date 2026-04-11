import { useState } from 'react'

// Configuración de prioridades: label, color del badge
// Usar un objeto de configuración en lugar de if/else es más mantenible
const PRIORITY_CONFIG = {
  high:   { label: 'Alta',  className: 'high'   },
  medium: { label: 'Media', className: 'medium' },
  low:    { label: 'Baja',  className: 'low'    },
}

function TaskItem({ task, onToggle, onDelete, onEdit, onPriorityChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.text)

  const handleEditSubmit = () => {
    if (editValue.trim() === '') { setEditValue(task.text); setIsEditing(false); return }
    onEdit(task.id, editValue)
    setIsEditing(false)
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEditSubmit()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setEditValue(task.text)
      setIsEditing(false)
    }
  }

  // Cicla entre las prioridades: high → medium → low → high
  const cyclePriority = () => {
    const order = ['high', 'medium', 'low']
    const next  = order[(order.indexOf(task.priority) + 1) % order.length]
    onPriorityChange(task.id, next)
  }

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium

  return (
    <li className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Marcar "${task.text}" como ${task.completed ? 'pendiente' : 'completada'}`}
      />

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleEditKeyDown}
          className="task-input task-edit-input"
          maxLength={120}
          autoFocus
        />
      ) : (
        <span
          className="task-text"
          onDoubleClick={() => { setEditValue(task.text); setIsEditing(true) }}
          title="Doble clic para editar"
        >
          {task.text}
        </span>
      )}

      {/* Badge de prioridad — al hacer clic cicla entre los 3 niveles */}
      {!isEditing && (
        <button
          onClick={cyclePriority}
          className={`priority-badge ${priority.className}`}
          title="Cambiar prioridad"
          aria-label={`Prioridad ${priority.label}. Clic para cambiar.`}
        >
          {priority.label}
        </button>
      )}

      {!isEditing && (
        <button
          onClick={() => { setEditValue(task.text); setIsEditing(true) }}
          className="btn-edit"
          aria-label="Editar tarea"
        >
          ✎
        </button>
      )}

      <button
        onClick={() => onDelete(task.id)}
        className="btn-delete"
        aria-label="Eliminar tarea"
      >
        ✕
      </button>
    </li>
  )
}

export default TaskItem