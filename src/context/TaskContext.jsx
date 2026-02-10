import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  filter: {
    status: 'All',
    priority: 'All',
    search: '',
  },
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, tasks: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'CLEAR_TASKS':
      return { ...state, tasks: [] };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      dispatch({ type: 'CLEAR_TASKS' });
    }
  }, [user]);

  const fetchTasks = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await api.get('/tasks/');
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  // Wrapper actions to call API first
  const addTask = async (taskData) => {
    try {
      const response = await api.post('/tasks/', taskData);
      dispatch({ type: 'ADD_TASK', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (taskData) => {
    try {
      // taskData should include id
      const response = await api.put(`/tasks/${taskData.id}/`, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}/`);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Expose dispatch as well for filter updates which don't need API
  const contextValue = {
    state,
    dispatch,
    filteredTasks: state.tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(state.filter.search.toLowerCase());
      const matchesPriority =
        state.filter.priority === 'All' || task.priority === state.filter.priority;
      const matchesStatus =
        state.filter.status === 'All' ||
        (state.filter.status === 'Completed' ? task.completed : !task.completed);

      return matchesSearch && matchesPriority && matchesStatus;
    }),
    summary: {
      total: state.tasks.length,
      completed: state.tasks.filter((t) => t.completed).length,
      pending: state.tasks.filter((t) => !t.completed).length,
    },
    actions: { addTask, updateTask, deleteTask, fetchTasks }
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
