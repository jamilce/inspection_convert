import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LookupRepository } from '../../../data/repositories/LookupRepository';
import type { LookupItem } from '../../../data/repositories/LookupRepository';

const CreateAudit: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language === 'ar' ? 'NameAr' : 'NameEn';

    // State for form fields (basic implementation)
    const [inspectionType, setInspectionType] = useState('');
    const [department, setDepartment] = useState('');
    const [teamRequired, setTeamRequired] = useState(false);
    const [groupInspection, setGroupInspection] = useState(false);
    const [employee, setEmployee] = useState('');
    const [establishmentType, setEstablishmentType] = useState('');
    const [establishment, setEstablishment] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [comments, setComments] = useState('');

    // Dropdown lookup data state
    const [departmentsList, setDepartmentsList] = useState<LookupItem[]>([]);
    const [establishmentTypesList, setEstablishmentTypesList] = useState<LookupItem[]>([]);

    useEffect(() => {
        LookupRepository.getDepartments().then(setDepartmentsList).catch(console.error);
        // By default load all establishment types (id=0 usually means all)
        LookupRepository.getEstablishmentTypes(0).then(setEstablishmentTypesList).catch(console.error);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted', { inspectionType, department, teamRequired, employee, establishmentType, establishment, dateStart, comments });
        // TODO: implement use case
    };

    return (
        <div className="container-fluid py-4">
            <div className="row g-4">
                {/* Main Form Area */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 pt-4 pb-0">
                            <h4 className="fw-bold text-success mb-0">
                                <i className="bi bi-file-earmark-plus me-2"></i> {t('Create New Audit', 'Create New Audit')}
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">

                                    {/* Inspection Type */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Type <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-card-checklist text-muted"></i></span>
                                            <select className="form-select" value={inspectionType} onChange={(e) => setInspectionType(e.target.value)} required>
                                                <option value="">Select Type...</option>
                                                <option value="1">Inspection</option>
                                                <option value="2">Audit</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Switches */}
                                    <div className="col-md-6">
                                        <div className="form-check form-switch mt-2">
                                            <input className="form-check-input" type="checkbox" role="switch" id="teamRequired" checked={teamRequired} onChange={(e) => setTeamRequired(e.target.checked)} />
                                            <label className="form-check-label fw-bold" htmlFor="teamRequired">Team Required</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check form-switch mt-2">
                                            <input className="form-check-input" type="checkbox" role="switch" id="groupInspection" checked={groupInspection} onChange={(e) => setGroupInspection(e.target.checked)} />
                                            <label className="form-check-label fw-bold" htmlFor="groupInspection">Group Inspection</label>
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Department <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-building text-muted"></i></span>
                                            <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                                                <option value="">Select Department...</option>
                                                {departmentsList.map(dep => (
                                                    <option key={dep.ID} value={dep.ID}>{dep[currentLang]}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Employees */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Employees <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-person text-muted"></i></span>
                                            <select className="form-select" value={employee} onChange={(e) => setEmployee(e.target.value)} required>
                                                <option value="">Select Employee...</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Establishment Type */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Establishment Type <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-shop text-muted"></i></span>
                                            <select className="form-select" value={establishmentType} onChange={(e) => setEstablishmentType(e.target.value)} required>
                                                <option value="">Select Establishment Type...</option>
                                                {establishmentTypesList.map(est => (
                                                    <option key={est.ID} value={est.ID}>{est[currentLang]}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Establishment */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Establishment <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-shop-window text-muted"></i></span>
                                            <select className="form-select" value={establishment} onChange={(e) => setEstablishment(e.target.value)} required>
                                                <option value="">Select Establishment...</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Date Start */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Date <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-calendar-event text-muted"></i></span>
                                            <input type="date" className="form-control" value={dateStart} onChange={(e) => setDateStart(e.target.value)} required />
                                        </div>
                                    </div>

                                    {/* Comments */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold">Comments</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-chat-text text-muted"></i></span>
                                            <textarea className="form-control" rows={3} value={comments} onChange={(e) => setComments(e.target.value)}></textarea>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-success px-4 fw-bold">
                                            <i className="bi bi-send me-2"></i> {t('Send', 'Send')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Side Panel for Upcoming Audits */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pt-4 pb-0">
                            <h5 className="card-title fw-bold">Upcoming Audits</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted small">No upcoming visits found.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateAudit;
