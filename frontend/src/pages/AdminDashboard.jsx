import React, { useEffect, useState } from 'react'
import { getUsers, getTasks, createTask, deleteTask } from '../api/adminApi'
import AdminRoute from '../components/AdminRoute'
import AdminTaskList from '../components/AdminTaskList'
import AdminTaskForm from '../components/AdminTaskForm'
import { getApiErrorMessage } from '../utils/errorMessage'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])

  const load = async () => {
    try {
      const u = await getUsers();
      setUsers(u.data.users || []);
      const t = await getTasks();
      setTasks(t.data.tasks || []);
    } catch (error) {
      alert(`Admin dashboard error: ${getApiErrorMessage(error)}`);
    }
  }

  useEffect(() => { load(); }, []);

  const onCreate = async (payload) => {
    try {
      await createTask(payload);
      await load();
    } catch (error) {
      alert(`Create task error: ${getApiErrorMessage(error)}`);
    }
  }

  const onDelete = async (id) => {
    try {
      await deleteTask(id);
      await load();
    } catch (error) {
      alert(`Delete task error: ${getApiErrorMessage(error)}`);
    }
  }

  return (
    <AdminRoute>
      <div className="page-center page-wide">
        <section className="card dashboard-card">
        <h2>Admin Dashboard</h2>
        <AdminTaskForm users={users} onCreate={onCreate} />
        <AdminTaskList tasks={tasks} onDelete={onDelete} />
        </section>
      </div>
    </AdminRoute>
  )
}
