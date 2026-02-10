import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiClock, FiList, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard({ setActiveTab }) {
    const { summary, state } = useTasks();
    const { user } = useAuth();

    const completionRate = summary.total > 0
        ? Math.round((summary.completed / summary.total) * 100)
        : 0;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="dashboard fade-in">
            <header className="dashboard-header">
                <div>
                    <h2 className="title">{getGreeting()}, {user?.username || 'User'}</h2>
                    <p className="subtitle">Here's what's happening with your tasks today.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveTab('My Tasks')}>
                    View All Tasks
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon icon-blue">
                        <FiList />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Tasks</span>
                        <span className="stat-value">{summary.total}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon icon-green">
                        <FiCheckCircle />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{summary.completed}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon icon-orange">
                        <FiClock />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Pending</span>
                        <span className="stat-value">{summary.pending}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon icon-purple">
                        <FiTrendingUp />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Progress</span>
                        <span className="stat-value">{completionRate}%</span>
                    </div>
                </div>
            </div>

            <div className="card progress-section">
                <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <h3 className="section-title">Overall Progress</h3>
                    <span className="font-semibold">{completionRate}% Completed</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${completionRate}%` }}
                    ></div>
                </div>
            </div>

            <div className="recent-activity">
                <h3 className="section-title">Recent Tasks</h3>
                <div className="recent-list">
                    {state.tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="recent-item">
                            <div className={`priority-dot ${task.priority.toLowerCase()}`}></div>
                            <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                                {task.title}
                            </span>
                            <span className="task-date">{task.due_date}</span>
                        </div>
                    ))}
                    {state.tasks.length === 0 && (
                        <p className="text-muted">No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
