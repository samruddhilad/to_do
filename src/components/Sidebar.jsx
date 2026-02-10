import { FiGrid, FiList, FiCheckSquare, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar({ activeTab, setActiveTab, isOpen }) {
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: <FiGrid /> },
        { name: 'My Tasks', icon: <FiList /> },
        { name: 'Completed', icon: <FiCheckSquare /> },
        { name: 'Settings', icon: <FiSettings /> },
    ];

    if (!isOpen) return null;

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <button
                                className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.name)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={logout}>
                    <span className="nav-icon"><FiLogOut /></span>
                    <span className="nav-label">Log Out</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
