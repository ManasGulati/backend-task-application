import React, { useState } from 'react'

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({ title: title.trim() });
    setTitle('');
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      <label className="field-label" htmlFor="task-title">Task title</label>
      <input id="task-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      <button className="btn btn-primary" type="submit">Add</button>
    </form>
  )
}
