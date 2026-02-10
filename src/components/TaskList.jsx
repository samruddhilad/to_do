import { useState } from 'react';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import ConfirmModal from './ConfirmModal';
import './TaskList.css';

function TaskList({ title, filterStatus = 'All' }) {
    const { filteredTasks, actions } = useTasks();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);

    const displayTasks = filteredTasks.filter(task =>
        filterStatus === 'All' ? true :
            filterStatus === 'Completed' ? task.completed :
                !task.completed
    );

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleDelete = (task) => {
        setDeletingTask(task);
    };

    const confirmDelete = async () => {
        await actions.deleteTask(deletingTask.id);
        setDeletingTask(null);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    // Custom Empty State Message
    const getEmptyState = () => {
        if (filterStatus === 'Completed') {
            return (
                <div className="empty-state">
                    <p>No completed tasks yet.</p>
                    <small className="text-secondary">Mark pending tasks as done to see them here.</small>
                </div>
            );
        }
        return (
            <div className="empty-state">
                <p>No tasks found.</p>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                    <FiPlus /> Create New Task
                </button>
            </div>
        );
    };

    return (
        <div className="task-list-container fade-in">
            <header className="page-header">
                <h2 className="title">{title}</h2>
                <div className="header-actions">
                    <button className="btn btn-outline" style={{ display: 'none' }}>
                        <FiFilter /> Filter
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                        <FiPlus /> Add Task
                    </button>
                </div>
            </header>

            <div className="tasks-grid">
                {displayTasks.length > 0 ? (
                    displayTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : getEmptyState()}
            </div>

            {isFormOpen && (
                <TaskForm onClose={closeForm} taskToEdit={editingTask} />
            )}

            {deletingTask && (
                <ConfirmModal
                    isOpen={!!deletingTask}
                    title="Delete Task"
                    message={`Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingTask(null)}
                />
            )}
        </div>
    );
}

export default TaskList;
