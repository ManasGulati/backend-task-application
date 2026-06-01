import React from 'react'
import useTasks from '../hooks/useTasks'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

export default function Dashboard() {
  const { tasks, loading, create, remove } = useTasks();

  return (
    <div className="page-center page-wide">
      <section className="card dashboard-card">
      <h2>My Tasks</h2>
      <TaskForm onCreate={create} />
      {loading ? <div className="message">Loading...</div> : <TaskList tasks={tasks} onDelete={remove} />}
      </section>
    </div>
  )
}
