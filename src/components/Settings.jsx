import { useAuth } from '../context/AuthContext';
import './Settings.css';

function Settings() {
    const { user } = useAuth();

    return (
        <div className="settings-container fade-in">
            <header className="page-header">
                <h2 className="title">Settings</h2>
            </header>

            <div className="settings-section">
                <h3>Profile Information</h3>
                <div className="settings-card">
                    <div className="setting-item">
                        <label>Username</label>
                        <div className="setting-value">{user?.username}</div>
                    </div>
                    <div className="setting-item">
                        <label>Email</label>
                        <div className="setting-value">{user?.email || 'No email provided'}</div>
                    </div>
                    <div className="setting-item">
                        <label>User ID</label>
                        <div className="setting-value">{user?.id}</div>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>Application</h3>
                <div className="settings-card">
                    <div className="setting-item">
                        <label>Version</label>
                        <div className="setting-value">1.0.0</div>
                    </div>
                    <div className="setting-item">
                        <label>Theme</label>
                        <div className="setting-value">Light (Default)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
