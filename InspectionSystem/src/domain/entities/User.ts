export interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    deptId: string;
    token: string | null;
    privilege: UserPrivilege;
    lang: 'en' | 'ar';
}

export interface UserPrivilege {
    IsCreateAudits: boolean;
    IsCreateEstablisment: boolean;
    IsCreateGroupInspection: boolean;
    IsCreateIncident: boolean;
    IsShowIncident: boolean;
    IsShowNotification: boolean;
    IsShowReports: boolean;
    IsShowInbox: boolean;
    IsShowEmployeeList: boolean;
    IsUpdateInspectionForm: boolean;
    IsDashboard: boolean;
    IsJSReport: boolean;
}
