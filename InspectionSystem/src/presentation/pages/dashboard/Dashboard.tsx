import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/reduxHooks';
import { DashboardRepository } from '../../../data/repositories/DashboardRepository';
import type { DashboardCounts } from '../../../data/repositories/DashboardRepository';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAppSelector((state) => state.auth);

    const [counts, setCounts] = useState<DashboardCounts | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Roles based on standard mappings
    const roleIdNum = parseInt(user?.roleId || '0', 10);
    const isInspector = roleIdNum === 4 || roleIdNum === 5 || roleIdNum === 6; // Staff, Admin, SystemManager
    const isHead = roleIdNum === 3;
    const isDirector = roleIdNum === 1 || roleIdNum === 2;

    useEffect(() => {
        if (isInspector) {
            setLoading(true);
            DashboardRepository.getEmployeeDashboard()
                .then(data => setCounts(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [isInspector]);

    return (
        <div className="container-fluid py-4">
            <h2 className="fw-bold mb-4 text-success">
                <i className="bi bi-speedometer2 me-2"></i> {t('Dashboard Overview', 'Dashboard Overview')}
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {isInspector && (
                <div className="row g-4 mb-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-4 pb-0">
                                <h5 className="card-title fw-bold">My Tasks</h5>
                            </div>
                            <div className="card-body">
                                {loading && <div className="spinner-border text-success" role="status" />}
                                {!loading && counts && (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Status</th>
                                                    <th className="text-end text-warning">Tasks</th>
                                                    <th className="text-end text-warning">Incidents</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><span className="badge bg-primary rounded-pill px-3">Inbox</span></td>
                                                    <td className="text-end fw-bold fs-5">{counts.ServiceCount?.inboxCount || 0}</td>
                                                    <td className="text-end fw-bold fs-5">{counts.BalaghatCount?.inboxCount || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-danger rounded-pill px-3">Pending</span></td>
                                                    <td className="text-end fw-bold fs-5 text-danger">{counts.ServiceCount?.pendingCount || 0}</td>
                                                    <td className="text-end fw-bold fs-5 text-danger">{counts.BalaghatCount?.pendingCount || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-success rounded-pill px-3">Completed</span></td>
                                                    <td className="text-end fw-bold fs-5 text-success">{counts.ServiceCount?.completedCount || 0}</td>
                                                    <td className="text-end fw-bold fs-5 text-success">{counts.BalaghatCount?.completedCount || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="badge bg-secondary rounded-pill px-3">All Tasks</span></td>
                                                    <td className="text-end fw-bold fs-5 text-secondary">{counts.ServiceCount?.All || 0}</td>
                                                    <td className="text-end fw-bold fs-5 text-secondary">{counts.BalaghatCount?.All || 0}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-0 pt-4 pb-0">
                                <h5 className="card-title fw-bold">Charts Summary</h5>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center bg-light rounded">
                                <p className="text-muted">Chart placeholders</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isHead && (
                <div className="alert alert-info border-0 shadow-sm mt-4">
                    <h5 className="alert-heading fw-bold">Department Head View</h5>
                    <p>Department specific metrics will appear here.</p>
                </div>
            )}

            {isDirector && (
                <div className="alert alert-secondary border-0 shadow-sm mt-4">
                    <h5 className="alert-heading fw-bold">Director View</h5>
                    <p>System-wide metrics and performance indicators will appear here.</p>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
