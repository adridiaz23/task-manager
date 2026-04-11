import { useState } from 'react'

function TaskForm({ onAdd }) {
  const [inputValue, setInputValue]   = useState('')
  const [error, setError]             = useState('')    // mensaje de error
  const [isDuplicate, setIsDuplicate] = useState(false) // para detectar duplicados

  // Recibe las tareas actuales para validar duplicados
  // (la pasamos como prop desde App en el siguiente paso)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = inputValue.trim()

    // Validación 1: campo vacío
    if (!trimmed) {
      setError('Escribe algo antes de añadir una tarea.')
      return
    }

    // Validación 2: longitud mínima
    if (trimmed.length < 3) {
      setError('La tarea debe tener al menos 3 caracteres.')
      return
    }

    // Validación 3: longitud máxima
    if (trimmed.length > 120) {
      setError('La tarea no puede superar los 120 caracteres.')
      return
    }

    // Si todo está bien, limpiamos el error y añadimos
    setError('')
    onAdd(trimmed)
    setInputValue('')
  }

  // Limpiamos el error mientras el usuario escribe
  const handleChange = (e) => {
    setInputValue(e.target.value)
    if (error) setError('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Escribe una nueva tarea..."
          // Añadimos la clase 'error' al input cuando hay un mensaje de error
          className={`task-input ${error ? 'error' : ''}`}
          // maxLength como red de seguridad adicional en el HTML
          maxLength={120}
          aria-describedby="task-error"
        />
        <button type="submit" className="btn-add">
          Añadir
        </button>
      </form>
      {/* Siempre renderizamos el div para evitar saltos de layout */}
      <p
        id="task-error"
        className="error-msg"
        role="alert"          // los lectores de pantalla lo anuncian automáticamente
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  )
}

export default TaskForm