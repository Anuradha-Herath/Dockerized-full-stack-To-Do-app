import { useState } from 'react'
import './TaskForm.css'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('Please enter a task title')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim()
      })
      
      // Reset form
      setTitle('')
      setDescription('')
    } catch (error) {
      console.error('Error adding task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
          disabled={isSubmitting}
          maxLength={100}
        />
      </div>
      
      <div className="form-group">
        <textarea
          placeholder="Add a description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="task-textarea"
          disabled={isSubmitting}
          rows={3}
          maxLength={500}
        />
      </div>
      
      <button 
        type="submit" 
        className="add-btn"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? '➕ Adding...' : '➕ Add Task'}
      </button>
    </form>
  )
}

export default TaskForm
