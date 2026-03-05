import React from 'react';
import { useTranslation } from 'react-i18next';

const Reports: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pt-4 pb-0">
                    <h4 className="fw-bold text-primary mb-0">
                        <i className="bi bi-file-earmark-bar-graph me-2"></i> {t('Reports', 'Reports')}
                    </h4>
                </div>
                <div className="card-body">
                    <form>
                        <div className="row g-3">
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">Type <span className="text-danger">*</span></label>
                                <select className="form-select">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">Department</label>
                                <select className="form-select">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">Employees</label>
                                <select className="form-select">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">Establishment Type</label>
                                <select className="form-select">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Establishment</label>
                                <input type="text" className="form-control" placeholder="Search Establishment..." />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">Risk Level</label>
                                <select className="form-select">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">Status</label>
                                <select className="form-select">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">From Date</label>
                                <input type="date" className="form-control" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">To Date</label>
                                <input type="date" className="form-control" />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold">Ref No.</label>
                                <input type="text" className="form-control" placeholder="e.g EAS-190701" />
                            </div>

                            <div className="col-12 mt-4">
                                <button type="button" className="btn btn-success px-4 me-2">
                                    <i className="bi bi-search me-2"></i> {t('Search', 'Search')}
                                </button>
                                <button type="button" className="btn btn-outline-secondary px-4">
                                    <i className="bi bi-x-circle me-2"></i> Clear
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Results Table Area */}
                    <div className="mt-5 pt-4 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <button className="btn btn-light btn-sm me-2 text-success" title="Export Excel"><i className="bi bi-file-earmark-excel fs-5"></i></button>
                                <button className="btn btn-light btn-sm text-danger" title="Export PDF"><i className="bi bi-file-earmark-pdf fs-5"></i></button>
                            </div>
                            <span className="badge bg-secondary p-2 fs-6">Total: 0</span>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-hover mt-2">
                                <thead className="table-light">
                                    <tr>
                                        <th>Ref No</th>
                                        <th>Establishment</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Inspector</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td colSpan={6} className="text-center text-muted py-4">No records found. Please adjust your search criteria.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
