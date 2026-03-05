import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Mailbox: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pt-4 pb-0">
                    <ul className="nav nav-tabs card-header-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link fw-bold ${activeTab === 'inbox' ? 'active text-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('inbox')}
                                type="button"
                                role="tab"
                            >
                                <i className="bi bi-inbox me-2"></i> {t('Inbox', 'Inbox')} <span className="badge bg-danger ms-1">3</span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link fw-bold ${activeTab === 'sent' ? 'active text-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('sent')}
                                type="button"
                                role="tab"
                            >
                                <i className="bi bi-send me-2"></i> {t('Sent Items', 'Sent Items')} <span className="badge bg-secondary ms-1">12</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold text-secondary mb-0">
                            {activeTab === 'inbox' ? t('Inbox Messages', 'Inbox Messages') : t('Sent Tasks', 'Sent Tasks')}
                        </h5>
                        <button className="btn btn-primary btn-sm">
                            <i className="bi bi-search me-1"></i> {t('Search', 'Search')}
                        </button>
                    </div>

                    <div className="row g-4">
                        {/* List Column */}
                        <div className="col-lg-4 border-end">
                            <div className="list-group list-group-flush">
                                {/* Placeholder items */}
                                <a href="#" className="list-group-item list-group-item-action active py-3">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6 className="mb-1 fw-bold">Audit EAS-190701</h6>
                                        <small>3 days ago</small>
                                    </div>
                                    <p className="mb-1 small">Assigned by: environmental_admin</p>
                                </a>
                                <a href="#" className="list-group-item list-group-item-action py-3">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6 className="mb-1 fw-bold">Incident Report #1029</h6>
                                        <small className="text-muted">1 week ago</small>
                                    </div>
                                    <p className="mb-1 small text-muted">Follow up required for establishment X</p>
                                </a>
                            </div>
                            <div className="text-center mt-3">
                                <button className="btn btn-link text-decoration-none btn-sm">Load More...</button>
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="col-lg-8">
                            <div className="p-3 bg-light rounded text-center text-muted h-100 d-flex flex-column justify-content-center">
                                <i className="bi bi-envelope-open display-1 mb-3"></i>
                                <p>Select an item to view details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mailbox;
