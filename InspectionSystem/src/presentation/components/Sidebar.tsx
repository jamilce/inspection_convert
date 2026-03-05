import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    return (
        <div
            className={`bg-light border-end h-100 position-fixed shadow-sm transition-all ${isOpen ? 'translate-0' : 'translate-middle-x'}`}
            style={{
                width: '280px',
                zIndex: 1000,
                transition: 'transform 0.3s ease-in-out',
                left: 0,
                top: '56px' // Height of navbar
            }}
        >
            <div className="list-group list-group-flush pt-3">
                <NavLink to="/dashboard" className={({ isActive }) => `list-group-item list-group-item-action py-3 border-0 ${isActive ? 'bg-primary text-white shadow-sm rounded-pill mx-2 active' : 'rounded-pill mx-2'}`}>
                    <i className="bi bi-house-door me-3 fs-5"></i>
                    <span>Home</span>
                </NavLink>

                <NavLink to="/create-audit" className={({ isActive }) => `list-group-item list-group-item-action py-3 border-0 mt-1 ${isActive ? 'bg-primary text-white shadow-sm rounded-pill mx-2 active' : 'rounded-pill mx-2'}`}>
                    <i className="bi bi-file-earmark-plus me-3 fs-5"></i>
                    <span>Create New Audit</span>
                </NavLink>

                <NavLink to="/create-establishment" className={({ isActive }) => `list-group-item list-group-item-action py-3 border-0 mt-1 ${isActive ? 'bg-primary text-white shadow-sm rounded-pill mx-2 active' : 'rounded-pill mx-2'}`}>
                    <i className="bi bi-plus-circle me-3 fs-5"></i>
                    <span>Create New Establishment</span>
                </NavLink>

                <NavLink to="/mailbox" className={({ isActive }) => `list-group-item list-group-item-action py-3 border-0 mt-1 ${isActive ? 'bg-primary text-white shadow-sm rounded-pill mx-2 active' : 'rounded-pill mx-2'}`}>
                    <i className="bi bi-mailbox me-3 fs-5"></i>
                    <span>Inbox</span>
                </NavLink>

                <NavLink to="/reports" className={({ isActive }) => `list-group-item list-group-item-action py-3 border-0 mt-1 ${isActive ? 'bg-primary text-white shadow-sm rounded-pill mx-2 active' : 'rounded-pill mx-2'}`}>
                    <i className="bi bi-file-earmark-bar-graph me-3 fs-5"></i>
                    <span>Reports</span>
                </NavLink>

                <div className="mt-auto px-3 py-4">
                    <small className="text-muted d-block text-center border-top pt-3">© 2026 MoCCaE - Inspection System</small>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
