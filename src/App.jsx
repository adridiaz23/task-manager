// App.jsx — componente raíz
// En React, un "componente" es una función que devuelve HTML (JSX)
import { useState, useEffect } from 'react'

function TaskForm({ onAdd }) {
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

function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks.length) {
    return <div className="empty-msg">No hay tareas todavía.</div>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item${task.completed ? ' completed' : ''}`}
        >
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
      ))}
    </ul>
  )
}

function App() {
  // useState([]) crea una variable de estado "tasks"
  // que empieza como array vacío.
  // Cuando llamamos a setTasks(...), React re-renderiza el componente.
  const [tasks, setTasks] = useState([])

  // useEffect se ejecuta DESPUÉS de que el componente se pinte.
  // El [] al final significa "solo la primera vez que monta el componente".
  // Aquí leemos las tareas guardadas en localStorage (si las hay).
  useEffect(() => {
    const saved = localStorage.getItem('tasks')
    // JSON.parse convierte el texto guardado de nuevo a array JavaScript
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  // Este useEffect guarda las tareas cada vez que el array "tasks" cambia.
  // [tasks] en el segundo argumento es la "dependencia": se ejecuta
  // cuando "tasks" cambia.
  useEffect(() => {
    // JSON.stringify convierte el array a texto para poder guardarlo
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Función para añadir una tarea nueva
  // Recibe el "text" desde el componente TaskForm
  const addTask = (text) => {
    const newTask = {
      id: Date.now(),      // id único usando timestamp actual
      text: text,          // el texto que escribió el usuario
      completed: false,    // por defecto, no está completada
    }
    // No modificamos el array directamente.
    // Creamos uno NUEVO con el spread operator (...tasks).
    // Esto es fundamental en React: nunca mutar el estado directamente.
    setTasks([...tasks, newTask])
  }

  // Función para marcar/desmarcar una tarea como completada
  // Recibe el id de la tarea a modificar
  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        // Si es la tarea que buscamos, invertimos "completed"
        // Si no, la dejamos igual
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  // Función para eliminar una tarea
  const deleteTask = (id) => {
    // filter crea un nuevo array sin la tarea con ese id
    setTasks(tasks.filter(task => task.id !== id))
  }

  // El JSX que devuelve es lo que se pinta en pantalla
  return (
    <div className="app">
      <h1>📝 Task Manager</h1>
      {/* Pasamos funciones como "props" a los componentes hijos */}
      <TaskForm onAdd={addTask} />
      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  )
}

export default App