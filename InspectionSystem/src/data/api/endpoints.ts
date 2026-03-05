export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: 'Account/getToken',
        VALIDATE: 'Account/isTokenValid'
    },
    DASHBOARD: {
        GET_EMPLOYEE_DASHBOARD: 'Dashboard/GetEmployeeDashboard',
        GET_TOTAL_ITEM: 'Dashboard/GetTotalItem_Dashboard',
        GET_INSPECTORS_COUNTS: 'Dashboard/GetInspectorsDetailCounts'
    },
    ESTABLISHMENT: {
        GET_ALL: 'Establishment/GetEstablisment',
        SEARCH: 'Establishment/GetEstablishmentSearch'
    },
    AUDIT: {
        GET_HISTORY: 'AuditService/GetAuditHistory',
        GET_INCIDENTS_MAILBOX: 'AuditService/GetIncidentDetailsMailbox',
        GET_AUDIT_MAILBOX: 'AuditService/GetAuditDetailsMailbox'
    },
    LOOKUP: {
        GET_ESTABLISHMENT_TYPE: 'Lookup/getEstablishmentType/',
        GET_DEPARTMENT: 'Lookup/getDepartment',
        GET_EMIRATE: 'Lookup/getEmirate',
        GET_RISK_LEVEL: 'Lookup/getRiskLevel',
        GET_AUDIT_TYPE: 'Lookup/GetAuditType',
        GET_STATUS_WORKFLOW: 'Lookup/GetStatus_Workflow'
    }
};
