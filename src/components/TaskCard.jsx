import { FiCalendar, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import './TaskCard.css';

function TaskCard({ task, onEdit, onDelete }) {
    const { actions } = useTasks();

    const handleToggle = () => {
        actions.updateTask({ ...task, completed: !task.completed });
    };

    const priorityClass = `badge badge-${task.priority.toLowerCase()}`;

    return (
        <div className={`task-card ${task.completed ? 'completed' : ''}`}>
            <div className="task-left">
                <label className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleToggle}
                    />
                    <span className="checkmark"></span>
                </label>

                <div className="task-content">
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-desc">{task.description}</p>

                    <div className="task-meta">
                        <span className={priorityClass}>{task.priority}</span>
                        <div className="task-date">
                            <FiCalendar size={14} />
                            <span>{task.due_date}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="task-actions">
                <button className="action-btn edit" onClick={() => onEdit(task)} aria-label="Edit Task">
                    <FiEdit2 size={18} />
                </button>
                <button className="action-btn delete" onClick={() => onDelete(task)} aria-label="Delete Task">
                    <FiTrash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default TaskCard;
