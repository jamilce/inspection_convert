import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { logout } from '../store/slices/authSlice';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const dispatch = useAppDispatch();
    const userName = useAppSelector((state) => state.auth.user?.name);

    const handleLogout = () => {
        dispatch(logout());
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-vh-100 bg-light">
            <Navbar
                userName={userName}
                onLogout={handleLogout}
                onToggleSidebar={toggleSidebar}
            />

            <div className="d-flex flex-grow-1">
                <Sidebar isOpen={isSidebarOpen} />

                <main
                    className="flex-grow-1 p-4 transition-all"
                    style={{
                        marginLeft: isSidebarOpen ? '280px' : '0',
                        transition: 'margin-left 0.3s ease-in-out',
                        minHeight: 'calc(100vh - 56px)'
                    }}
                >
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
