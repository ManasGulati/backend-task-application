import React from 'react'

export default function AdminTaskList({ tasks = [], onDelete }) {
  if (!tasks.length) {
    return <div className="empty-state">No tasks available for admin management.</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map(t => (
        <li className="task-item" key={t._id}>
          <span>{t.title} - {t.user ? t.user.name : 'unknown'}</span>
          <button className="btn btn-danger" onClick={() => onDelete(t._id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
