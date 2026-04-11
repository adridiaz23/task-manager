function TaskList({ tasks, allTasksCount, onToggle, onDelete, onEdit, onPriorityChange }) {
  // allTasksCount: total de tareas sin filtrar (lo añadiremos en App)
  // Lo usamos para distinguir "no hay tareas" de "el filtro no encuentra nada"

  if (tasks.length === 0) {
    // Caso 1: no hay ninguna tarea creada todavía
    if (allTasksCount === 0) {
      return (
        <div className="empty-msg">
          <span>📋</span>
          <strong>Todo listo</strong>
          <p>Añade tu primera tarea para empezar.</p>
        </div>
      )
    }
    // Caso 2: hay tareas pero el filtro activo no devuelve ninguna
    return (
      <div className="empty-msg">
        <span>🔍</span>
        <strong>Sin resultados</strong>
        <p>No hay tareas que coincidan con este filtro.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onPriorityChange={onPriorityChange}
        />
      ))}
    </ul>
  )
}

export default TaskList