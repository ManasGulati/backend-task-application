import React from 'react'

export default function TaskList({ tasks = [], onDelete }) {
  if (!tasks.length) {
    return <div className="empty-state">No tasks yet. Add one to get started.</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map(t => (
        <li className="task-item" key={t._id}>
          <span>{t.title}</span>
          <button className="btn btn-danger" onClick={() => onDelete(t._id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
