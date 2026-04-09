import TaskItem from './TaskItem.jsx'

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks.length) {
    return <div className="empty-msg">No hay tareas todavía.</div>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
