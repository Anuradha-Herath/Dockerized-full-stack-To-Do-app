import { useState } from 'react'
import './TaskList.css'

function TaskList({ tasks, onToggleTask, onDeleteTask, onUpdateTask }) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleEditStart = (task) => {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty')
      return
    }

    try {
      await onUpdateTask(id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      })
      setEditingId(null)
      setEditTitle('')
      setEditDescription('')
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleToggle = (task) => {
    onToggleTask(task._id, !task.completed)
  }

  const handleDelete = (task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task._id)
    }
  }

  const completedTasks = tasks.filter(task => task.completed)
  const incompleteTasks = tasks.filter(task => !task.completed)

  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="empty-state">
          <h3>🎉 No tasks yet!</h3>
          <p>Add your first task above to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="task-list">
      {incompleteTasks.length > 0 && (
        <section className="task-section">
          <h3 className="section-title">
            📋 Todo ({incompleteTasks.length})
          </h3>
          <div className="tasks">
            {incompleteTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                isEditing={editingId === task._id}
                editTitle={editTitle}
                editDescription={editDescription}
                onEditStart={handleEditStart}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
                onEditTitleChange={setEditTitle}
                onEditDescriptionChange={setEditDescription}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section className="task-section">
          <h3 className="section-title">
            ✅ Completed ({completedTasks.length})
          </h3>
          <div className="tasks">
            {completedTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                isEditing={editingId === task._id}
                editTitle={editTitle}
                editDescription={editDescription}
                onEditStart={handleEditStart}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
                onEditTitleChange={setEditTitle}
                onEditDescriptionChange={setEditDescription}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function TaskItem({
  task,
  isEditing,
  editTitle,
  editDescription,
  onEditStart,
  onEditCancel,
  onEditSave,
  onEditTitleChange,
  onEditDescriptionChange,
  onToggle,
  onDelete
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            className="edit-input"
            placeholder="Task title"
            maxLength={100}
          />
          <textarea
            value={editDescription}
            onChange={(e) => onEditDescriptionChange(e.target.value)}
            className="edit-textarea"
            placeholder="Description (optional)"
            rows={3}
            maxLength={500}
          />
          <div className="edit-actions">
            <button
              onClick={() => onEditSave(task._id)}
              className="save-btn"
              disabled={!editTitle.trim()}
            >
              💾 Save
            </button>
            <button
              onClick={onEditCancel}
              className="cancel-btn"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="checkbox"
        />
      </div>
      
      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span className="task-date">
            Created: {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="task-actions">
        <button
          onClick={() => onEditStart(task)}
          className="edit-btn"
          title="Edit task"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(task)}
          className="delete-btn"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default TaskList
