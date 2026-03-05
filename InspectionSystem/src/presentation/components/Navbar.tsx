import React from 'react';

interface NavbarProps {
    userName?: string;
    onLogout: () => void;
    onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, onLogout, onToggleSidebar }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm">
            <div className="container-fluid">
                <button
                    className="btn btn-link text-white me-2"
                    onClick={onToggleSidebar}
                    aria-label="Toggle navigation"
                >
                    <i className="bi bi-list fs-4"></i>
                </button>
                <a className="navbar-brand fw-bold" href="#">MOCCAE Audit System</a>

                <div className="ms-auto d-flex align-items-center">
                    <div className="dropdown">
                        <button
                            className="btn btn-link text-white dropdown-toggle text-decoration-none"
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-person-circle me-1"></i>
                            <span>{userName || 'User'}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                            <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Profile</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item text-danger" onClick={onLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
