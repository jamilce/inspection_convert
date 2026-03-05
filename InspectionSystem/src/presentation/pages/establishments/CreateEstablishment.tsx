import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LookupRepository } from '../../../data/repositories/LookupRepository';
import type { LookupItem } from '../../../data/repositories/LookupRepository';

const CreateEstablishment: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language === 'ar' ? 'NameAr' : 'NameEn';

    const [formData, setFormData] = useState({
        departmentId: '',
        establishmentTypeId: '',
        emirateId: '',
        tradeLicenseNumber: '',
        area: '',
        nameAr: '',
        nameEn: '',
        lat: '',
        lng: '',
        mobile: '',
        email: ''
    });

    const [departmentsList, setDepartmentsList] = useState<LookupItem[]>([]);
    const [establishmentTypesList, setEstablishmentTypesList] = useState<LookupItem[]>([]);
    const [emiratesList, setEmiratesList] = useState<LookupItem[]>([]);

    useEffect(() => {
        LookupRepository.getDepartments().then(setDepartmentsList).catch(console.error);
        LookupRepository.getEstablishmentTypes(0).then(setEstablishmentTypesList).catch(console.error);
        LookupRepository.getEmirates().then(setEmiratesList).catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('New Establishment', formData);
    };

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold text-primary mb-0">
                        <i className="bi bi-building-add me-2"></i> {t('Create New Establishment', 'Create New Establishment')}
                    </h4>
                    <div>
                        <button type="submit" form="frmNewEst" className="btn btn-primary rounded-circle shadow-sm me-2" title="Save">
                            <i className="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <form id="frmNewEst" onSubmit={handleSubmit}>
                        <div className="row g-3">

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Department</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-building"></i></span>
                                    <select className="form-select" name="departmentId" value={formData.departmentId} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        {departmentsList.map(dep => (
                                            <option key={dep.ID} value={dep.ID}>{dep[currentLang]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Establishment Type</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-shop"></i></span>
                                    <select className="form-select" name="establishmentTypeId" value={formData.establishmentTypeId} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        {establishmentTypesList.map(est => (
                                            <option key={est.ID} value={est.ID}>{est[currentLang]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Emirate</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-geo-alt"></i></span>
                                    <select className="form-select" name="emirateId" value={formData.emirateId} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        {emiratesList.map(emirate => (
                                            <option key={emirate.ID} value={emirate.ID}>{emirate[currentLang]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">License No</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-hash"></i></span>
                                    <input type="text" className="form-control" name="tradeLicenseNumber" value={formData.tradeLicenseNumber} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Area</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-compass"></i></span>
                                    <input type="text" className="form-control" name="area" value={formData.area} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Name (Ar)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-type"></i></span>
                                    <input type="text" className="form-control" name="nameAr" value={formData.nameAr} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Name (En)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-type"></i></span>
                                    <input type="text" className="form-control" name="nameEn" value={formData.nameEn} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Latitude</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-pin-map"></i></span>
                                    <input type="text" className="form-control" name="lat" value={formData.lat} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Longitude</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-pin-map"></i></span>
                                    <input type="text" className="form-control" name="lng" value={formData.lng} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Mobile</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-phone"></i></span>
                                    <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <label className="form-label fw-bold">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>

                        </div>
                    </form>

                    {/* Search Section */}
                    <div className="mt-5 pt-4 border-top border-warning">
                        <h6 className="fw-bold mb-3 text-secondary">Search Existing Establishments</h6>
                        <div className="row g-3">
                            <div className="col-md-5">
                                <input type="text" className="form-control bg-light" placeholder="Search by Name (Ar/En)" />
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control bg-light" placeholder="Search by License No." />
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-success me-2"><i className="bi bi-search"></i> Search</button>
                                <button className="btn btn-outline-danger"><i className="bi bi-eraser"></i> Clear</button>
                            </div>
                        </div>

                        {/* Results table placeholder */}
                        <div className="table-responsive mt-3">
                            <table className="table table-striped table-hover mt-2">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>License No</th>
                                        <th>Area</th>
                                        <th>Mobile</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td colSpan={4} className="text-center text-muted">No records found</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateEstablishment;
