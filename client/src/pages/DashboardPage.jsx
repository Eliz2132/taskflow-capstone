import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: ''
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
      } else {
        await api.post('/tasks', formData);
      }

      setFormData(emptyForm);
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Task action failed.');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
    });
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task.');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filter.status === 'all' || task.status === filter.status;
    const priorityMatch = filter.priority === 'all' || task.priority === filter.priority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="dashboard-shell">
      <nav className="navbar">
        <div className="brand-link">TaskFlow</div>
        <div className="nav-actions">
          <div className="user-badge">
            <span className="user-initial">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            <span>{user?.name || 'User'}</span>
          </div>
          <button className="secondary-button" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <div className="eyebrow">Dashboard</div>
            <h2>Task Management</h2>
          </div>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>{editingId ? 'Edit task' : 'Add a new task'}</h3>
            {editingId && (
              <button type="button" className="ghost-button" onClick={() => { setEditingId(null); setFormData(emptyForm); }}>
                Cancel
              </button>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          <div className="two-column-grid">
            <div className="input-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="dueDate">Due date</label>
            <input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
          </div>

          {error && <div className="form-error dashboard-error">{error}</div>}

          <button className="primary-button" type="submit">
            {editingId ? 'Update task' : 'Save task'}
          </button>
        </form>

        <div className="task-list-wrapper">
          <div className="two-column-grid" style={{ marginBottom: '20px' }}>
            <div className="input-group">
              <label htmlFor="statusFilter">Filter by status</label>
              <select id="statusFilter" value={filter.status} onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="all">All</option>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="priorityFilter">Filter by priority</label>
              <select id="priorityFilter" value={filter.priority} onChange={(e) => setFilter((prev) => ({ ...prev, priority: e.target.value }))}>
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">No tasks found.</div>
          ) : (
            <div className="task-grid">
              {filteredTasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <div className="task-card-top">
                    <h4>{task.title}</h4>
                    <span className={`status-pill status-${task.status.replace(/\s+/g, '-')}`}>
                      {task.status}
                    </span>
                  </div>

                  <p>{task.description || 'No description provided.'}</p>

                  <div className="task-meta">
                    <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                    <span className="due-date">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                  </div>

                  <div className="task-actions">
                    <button className="secondary-button" onClick={() => handleEdit(task)}>Edit</button>
                    <button className="danger-button" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
