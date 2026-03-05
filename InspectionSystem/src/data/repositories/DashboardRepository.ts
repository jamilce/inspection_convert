import { axiosInstance } from '../api/axiosInstance';
import type { ApiResponse } from './AuthRepository';
import { API_ENDPOINTS } from '../api/endpoints';

export interface DashboardCounts {
    BalaghatCount: {
        inboxCount: number;
        sentCount: number;
        pendingCount: number;
        completedCount: number;
        UnreadCount: number;
        All: number;
    };
    ServiceCount: {
        inboxCount: number;
        pendingCount: number;
        completedCount: number;
        UnreadCount: number;
        CompletedAsTeamPlayer: number;
        All: number;
    };
}

export const DashboardRepository = {
    getEmployeeDashboard: async (): Promise<DashboardCounts> => {
        const response = await axiosInstance.post<ApiResponse<DashboardCounts>>(API_ENDPOINTS.DASHBOARD.GET_EMPLOYEE_DASHBOARD, {});
        if (response.data.IsSuccess) {
            return response.data.ResponseData;
        } else {
            throw new Error(response.data.Message || 'Failed to fetch dashboard data');
        }
    }
};
