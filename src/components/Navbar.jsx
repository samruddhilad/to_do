import { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar({ toggleSidebar }) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    const notifications = [
        { id: 1, text: "Welcome to Task Manager!", time: "Just now" },
        { id: 2, text: "Your profile is set up.", time: "1 min ago" }
    ];

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                    <FiMenu size={24} />
                </button>
                <div className="brand">
                    <div className="brand-logo">TM</div>
                    <h1 className="brand-name">Task Manager</h1>
                </div>
            </div>

            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Search anything..." />
            </div>

            <div className="navbar-right">
                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-btn"
                        aria-label="Notifications"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <FiBell size={20} />
                        <span className="notification-dot"></span>
                    </button>

                    {showNotifications && (
                        <div className="notifications-dropdown fade-in">
                            <div className="dropdown-header">
                                <span>Notifications</span>
                                <button onClick={() => setShowNotifications(false)}><FiX /></button>
                            </div>
                            <div className="dropdown-list">
                                {notifications.map(n => (
                                    <div key={n.id} className="notification-item">
                                        <p>{n.text}</p>
                                        <small>{n.time}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile">
                    <div className="avatar">{getInitials(user?.username)}</div>
                    <span className="username">{user?.username || 'Guest'}</span>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
