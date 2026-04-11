import { useState, useEffect } from 'react'
import TaskForm    from './components/TaskForm'
import TaskList    from './components/TaskList'
import FilterBar   from './components/FilterBar'

function App() {
  const [tasks,  setTasks]  = useState([])
  const [filter, setFilter] = useState('all')

  // NUEVO: estado del tema. Leemos del localStorage para recordar la preferencia
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  // NUEVO: sincronizamos el atributo data-theme en <html> cada vez que cambia darkMode
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    )
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const saved = localStorage.getItem('tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask    = (text)          => setTasks([...tasks, { id: Date.now(), text, completed: false, priority: 'medium' }])
  const toggleTask = (id)            => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  const deleteTask = (id)            => setTasks(tasks.filter(t => t.id !== id))
  const editTask = (id, newText) => {
    const trimmed = newText.trim()
    if (!trimmed) return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)))
  }

  // NUEVO: cambiar la prioridad de una tarea (Commit 4)
  const changePriority = (id, priority) => setTasks(tasks.map(t => t.id === id ? { ...t, priority } : t))

  const filteredTasks  = tasks.filter(t => filter === 'pending' ? !t.completed : filter === 'completed' ? t.completed : true)
  const totalCount     = tasks.length
  const pendingCount   = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Task Manager</h1>
        {/* Toggle tema oscuro/claro */}
        <button
          className="btn-theme"
          onClick={() => setDarkMode(d => !d)}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </header>

      <TaskForm onAdd={addTask} />

      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        totalCount={totalCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
      />

      <TaskList
        tasks={filteredTasks}
        allTasksCount={totalCount}   
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
        onPriorityChange={changePriority}
      />
    </div>
  )
}

export default App