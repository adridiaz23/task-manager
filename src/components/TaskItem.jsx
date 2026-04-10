// TaskItem.jsx — con edición inline
import { useState } from 'react'

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  // Estado LOCAL de este componente: ¿estamos editando ahora mismo?
  // No sube a App porque solo le importa a este componente.
  const [isEditing, setIsEditing] = useState(false)

  // Estado LOCAL para el texto del input mientras se edita
  // Lo inicializamos con el texto actual de la tarea
  const [editValue, setEditValue] = useState(task.text)

  // Se llama cuando el usuario confirma la edición
  // (pulsando Enter o haciendo clic fuera del input — onBlur)
  const handleEditSubmit = () => {
    // Si el campo quedó vacío, cancelamos sin borrar la tarea
    if (editValue.trim() === '') {
      setEditValue(task.text)  // restauramos el valor original
      setIsEditing(false)
      return
    }
    onEdit(task.id, editValue)  // llamamos a App con el nuevo texto
    setIsEditing(false)         // volvemos al modo vista
  }

  // Se llama cuando el usuario pulsa una tecla en el input de edición
  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter')  handleEditSubmit()   // confirmar con Enter
    if (e.key === 'Escape') {
      // Cancelar con Escape: restauramos el valor original
      setEditValue(task.text)
      setIsEditing(false)
    }
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      {/* Renderizado condicional: si isEditing es true mostramos
          el input; si no, mostramos el texto normal */}
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}    // confirmar al perder el foco
          onKeyDown={handleEditKeyDown}
          className="task-input task-edit-input"
          // autoFocus: el cursor aparece automáticamente en el input
          autoFocus
        />
      ) : (
        <span
          className="task-text"
          // Doble clic para activar el modo edición
          onDoubleClick={() => {
            setEditValue(task.text)  // sincronizamos con el valor actual
            setIsEditing(true)
          }}
          title="Doble clic para editar"
        >
          {task.text}
        </span>
      )}

      {/* Botón de editar (alternativa al doble clic) */}
      {!isEditing && (
        <button
          onClick={() => {
            setEditValue(task.text)
            setIsEditing(true)
          }}
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