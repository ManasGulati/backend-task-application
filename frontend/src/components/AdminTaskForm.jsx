import React, { useEffect, useState } from 'react'

export default function AdminTaskForm({ users = [], onCreate }) {
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(users[0]?._id || '');

  useEffect(() => {
    if (!user && users.length) setUser(users[0]._id);
  }, [users, user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    await onCreate({ title: title.trim(), user });
    setTitle('');
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      <label className="field-label" htmlFor="admin-task-title">Task title</label>
      <input id="admin-task-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      <label className="field-label" htmlFor="admin-task-user">Assign user</label>
      <select id="admin-task-user" className="input" value={user} onChange={(e) => setUser(e.target.value)}>
        <option value="">Select user</option>
        {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
      </select>
      <button className="btn btn-primary" type="submit">Create for user</button>
    </form>
  )
}
