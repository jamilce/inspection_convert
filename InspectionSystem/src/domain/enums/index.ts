// Extracted from original config.js

export const EmployeeRole = {
    Directors: 1,
    Department_Head: 3,
    Department_Staff: 4,
    SystemManager: 5,
    Admin: 6,
    CustomerService: 7
} as const;
export type EmployeeRole = typeof EmployeeRole[keyof typeof EmployeeRole];

export const InspectorRoles = {
    UnderSecretary: 1,
    SecretaryOfUnderSecretary: 2,
    DepartmentHead: 3,
    DepartmentStaff: 4,
    SystemManager: 5,
    Administrator: 6,
} as const;
export type InspectorRoles = typeof InspectorRoles[keyof typeof InspectorRoles];

export const Departments = {
    Environmental_Audit_Section: 1,
    Agricultural_Audit_Section: 2,
    Fisheries_Audit_Section: 3,
    Animal_Inspection_Section: 4
} as const;
export type Departments = typeof Departments[keyof typeof Departments];

export const MarketType = {
    FishMarket: 1,
    Others: 2,
    FishBoat: 3
} as const;
export type MarketType = typeof MarketType[keyof typeof MarketType];

export const AuditType = {
    audit: 1,
    inspection: 2,
    taqeem: 3,
    audit_other: 4,
} as const;
export type AuditType = typeof AuditType[keyof typeof AuditType];

export const RiskLevelID = {
    HighRisk: 1,
    AverageRisk: 2,
    LowRisk: 3
} as const;
export type RiskLevelID = typeof RiskLevelID[keyof typeof RiskLevelID];

// Maps to the DepartmentName array from config.js
export const DepartmentNames = [
    { ID: "1", NameAr: "قسم البيئي", NameEn: "Environmental Section" },
    { ID: "2", NameAr: "قسم الزراعي", NameEn: "Agricultural Section" },
    { ID: "3", NameAr: "قسم  السمكي", NameEn: "Fisheries Section" },
    { ID: "4", NameAr: "قسم الحيواني", NameEn: "Animal Section" }
];
