import { useState, useEffect } from 'react'
import axios from 'axios'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

// Configure axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.defaults.baseURL = API_BASE_URL

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/tasks')
      setTasks(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add new task
  const addTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData)
      setTasks(prev => [response.data, ...prev])
      setError(null)
    } catch (err) {
      setError('Failed to add task')
      console.error('Error adding task:', err)
    }
  }

  // Update task
  const updateTask = async (id, updates) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, updates)
      setTasks(prev => 
        prev.map(task => 
          task._id === id ? response.data : task
        )
      )
      setError(null)
    } catch (err) {
      setError('Failed to update task')
      console.error('Error updating task:', err)
    }
  }

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`)
      setTasks(prev => prev.filter(task => task._id !== id))
      setError(null)
    } catch (err) {
      setError('Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  // Toggle task completion
  const toggleTask = async (id, completed) => {
    await updateTask(id, { completed })
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 Todo App</h1>
          <p>Stay organized and get things done!</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <TaskForm onAddTask={addTask} />

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList 
            tasks={tasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        )}
      </div>
    </div>
  )
}

export default App
