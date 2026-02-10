import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import './TaskForm.css';

function TaskForm({ onClose, taskToEdit = null }) {
    const { actions, dispatch } = useTasks(); // Updated to use actions
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        due_date: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setFormData(taskToEdit);
        }
    }, [taskToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return;

        let result;
        if (taskToEdit) {
            result = await actions.updateTask(formData);
        } else {
            result = await actions.addTask(formData);
        }

        if (result.success) {
            onClose();
        } else {
            alert('Error saving task: ' + result.error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content fade-in">
                <div className="modal-header">
                    <h3>{taskToEdit ? 'Edit Task' : 'Add New Task'}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Weekly Team Meeting"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add details..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm;
