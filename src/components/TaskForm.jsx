import { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form className="task-form" onSubmit={onSubmit}>
      <input
        className="task-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe una tarea…"
        aria-label="Nueva tarea"
      />
      <button className="btn-add" type="submit">
        Añadir
      </button>
    </form>
  )
}
