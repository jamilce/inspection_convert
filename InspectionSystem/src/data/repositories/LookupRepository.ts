import { axiosInstance } from '../api/axiosInstance';
import { API_ENDPOINTS } from '../api/endpoints';
import type { ApiResponse } from './AuthRepository';

export interface LookupItem {
    ID: number | string;
    NameAr: string;
    NameEn: string;
    [key: string]: any;
}

export const LookupRepository = {
    getDepartments: async (id: number = 0): Promise<LookupItem[]> => {
        const response = await axiosInstance.get<ApiResponse<LookupItem[]>>(`${API_ENDPOINTS.LOOKUP.GET_DEPARTMENT}?id=${id}`);
        if (response.data.IsSuccess) return response.data.ResponseData;
        throw new Error(response.data.Message || 'Failed to fetch departments');
    },

    getEstablishmentTypes: async (deptId: number = 0): Promise<LookupItem[]> => {
        const response = await axiosInstance.get<ApiResponse<LookupItem[]>>(`${API_ENDPOINTS.LOOKUP.GET_ESTABLISHMENT_TYPE}${deptId}`);
        if (response.data.IsSuccess) return response.data.ResponseData;
        throw new Error(response.data.Message || 'Failed to fetch establishment types');
    },

    getEmirates: async (): Promise<LookupItem[]> => {
        const response = await axiosInstance.get<ApiResponse<LookupItem[]>>(API_ENDPOINTS.LOOKUP.GET_EMIRATE);
        if (response.data.IsSuccess) return response.data.ResponseData;
        throw new Error(response.data.Message || 'Failed to fetch emirates');
    },

    getRiskLevels: async (): Promise<LookupItem[]> => {
        const response = await axiosInstance.get<ApiResponse<LookupItem[]>>(API_ENDPOINTS.LOOKUP.GET_RISK_LEVEL);
        if (response.data.IsSuccess) return response.data.ResponseData;
        throw new Error(response.data.Message || 'Failed to fetch risk levels');
    },

    getAuditTypes: async (): Promise<LookupItem[]> => {
        const response = await axiosInstance.get<ApiResponse<LookupItem[]>>(API_ENDPOINTS.LOOKUP.GET_AUDIT_TYPE);
        if (response.data.IsSuccess) return response.data.ResponseData;
        throw new Error(response.data.Message || 'Failed to fetch audit types');
    }
};
