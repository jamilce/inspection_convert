import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const userDataStr = localStorage.getItem('SmartAudit');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (e) {
        console.error('Failed to parse user data for auth:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('SmartAudit');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods organized by domain
export const api = {
  // Auth
  auth: {
    login: (username: string, password: string) =>
      axiosInstance.post('/Account/getToken', { username, password }),
    isTokenValid: async () => {
      try {
        const response = await axiosInstance.get('/Account/isTokenValid');
        return response.data?.IsSuccess === true;
      } catch {
        return false;
      }
    },
  },

  // Dashboard
  dashboard: {
    getEmployeeDashboard: () => axiosInstance.get('/Dashboard/GetEmployeeDashboard'),
    getServiceByAuditType: () => axiosInstance.get('/Dashboard/GetServiceByAuditType'),
    getServiceByRiskLevel: () => axiosInstance.get('/Dashboard/GetServiceByRisklevel'),
    getInspectorsDetailCounts: () => axiosInstance.get('/Dashboard/GetInspectorsDetailCounts'),
    getTotalItemDashboard: () => axiosInstance.get('/Dashboard/GetTotalItem_Dashboard'),
  },

  // Establishments
  establishments: {
    search: (params: any) => 
      axiosInstance.post('/Establishment/GetEstablishmentSearch', params),
    getById: (id: string) => 
      axiosInstance.post('/Establishment/GetEstablishmentByID', { EstablishmentID: id }),
    create: (data: any) => 
      axiosInstance.post('/Establishment/AddNewEstablisment', data),
    update: (data: any) => 
      axiosInstance.post('/Establishment/UpdateEstablishment', data),
    delete: (id: string) => 
      axiosInstance.post('/Establishment/DeleteEstablisment', { EstablishmentID: id }),
  },

  // Audits/Inspections
  audits: {
    create: (data: any) => 
      axiosInstance.post('/AuditService/CreateAudit', data),
    getById: (id: string) => 
      axiosInstance.post('/AuditService/GetAuditByID', { AuditServiceID: id }),
    search: (params: any) => 
      axiosInstance.post('/AuditService/SearchAuditsService', params),
    submit: (data: any) => 
      axiosInstance.post('/AuditService/SubmitAudit', data),
    getAuditDetail: (auditId: string) => 
      axiosInstance.get(`/AuditService/GetAuditDetail/${auditId}`),
  },

  // Inspection Forms
  inspections: {
    getQuestions: (establishmentTypeId: string) => 
      axiosInstance.get(`/Inspection/GetInspectionQuestion${establishmentTypeId}`),
    submitInspection: (data: any) => 
      axiosInstance.post('/Inspection/SubmitInspection', data),
    getInspectionDetails: (auditServiceId: string) => 
      axiosInstance.post('/Inspection/GetInspectionDetailsForm', { AuditServiceID: auditServiceId }),
  },

  // Lookups
  lookups: {
    getEstablishmentTypes: (deptId: string) => 
      axiosInstance.get(`/Lookup/getEstablishmentType/${deptId}`),
    getAuditsLookup: (establishmentTypeId: string) => 
      axiosInstance.post('/Lookup/GetAuditsLookup', { EstablishmentTypeID: establishmentTypeId }),
    getDepartments: () => 
      axiosInstance.get('/Lookup/getDepartments'),
    getEmirates: () => 
      axiosInstance.get('/Lookup/getEmirates'),
  },

  // Employees
  employees: {
    search: (params: any) => 
      axiosInstance.post('/Employee/SearchEmployee', params),
    getById: (id: string) => 
      axiosInstance.get(`/Employee/GetEmployeeById/${id}`),
    create: (data: any) => 
      axiosInstance.post('/Employee/AddNewEmployee', data),
    update: (data: any) => 
      axiosInstance.post('/Employee/UpdateEmployee', data),
  },

  // Incidents
  incidents: {
    search: (params: any) => 
      axiosInstance.post('/Incident/SearchIncident', params),
    getById: (id: string) => 
      axiosInstance.get(`/Incident/GetIncidentById/${id}`),
    create: (data: any) => 
      axiosInstance.post('/Incident/CreateIncident', data),
  },

  // Mailbox/Notifications
  mailbox: {
    getInbox: (params: any) => 
      axiosInstance.post('/Mailbox/GetInbox', params),
    getSentItems: (params: any) => 
      axiosInstance.post('/Mailbox/GetSentItems', params),
    markAsRead: (id: string) => 
      axiosInstance.post('/Mailbox/MarkAsRead', { MessageID: id }),
  },
};

export default axiosInstance;
