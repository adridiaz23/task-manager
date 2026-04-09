import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
// import FilterBar from './components/FilterBar' // ← descomenta cuando exista ./components/FilterBar.jsx

function App() {
  const [tasks, setTasks] = useState([])

  // NUEVO: estado para el filtro activo
  // Puede ser 'all', 'pending' o 'completed'
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (text) => {
    setTasks([...tasks, {
      id: Date.now(),
      text,
      completed: false,
    }])
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // NUEVO: función para editar el texto de una tarea existente
  // Recibe el id de la tarea a editar y el nuevo texto
  const editTask = (id, newText) => {
    // Si el nuevo texto está vacío, no hacemos nada
    // (la validación también existe en TaskItem, pero es buena práctica
    //  validar en ambos lados: en el componente y en la fuente de verdad)
    if (!newText.trim()) return

    setTasks(tasks.map(task =>
      // Si es la tarea que buscamos, devolvemos una copia con el texto nuevo
      // El spread ...task conserva id y completed intactos
      task.id === id ? { ...task, text: newText.trim() } : task
    ))
  }

  // NUEVO: lógica de filtrado
  // En lugar de pasar "tasks" directamente a TaskList, calculamos
  // "filteredTasks" basándonos en el filtro activo.
  // Esto NO modifica el estado original, solo crea una vista derivada.
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending')   return !task.completed
    if (filter === 'completed') return task.completed
    return true  // 'all': devolvemos todas
  })

  // NUEVO: contadores para mostrar en la UI
  const totalCount     = tasks.length
  const pendingCount   = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="app">
      <h1>📝 Task Manager</h1>

      <TaskForm onAdd={addTask} />

      {/* FilterBar: descomenta import arriba y este bloque cuando exista ./components/FilterBar.jsx
      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        totalCount={totalCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
      />
      */}

      {/* Pasamos filteredTasks en lugar de tasks */}
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />
    </div>
  )
}

export default App