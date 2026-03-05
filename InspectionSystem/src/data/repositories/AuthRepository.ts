import { axiosInstance } from '../api/axiosInstance';
import type { User } from '../../domain/entities/User';
import { API_ENDPOINTS } from '../api/endpoints';

export interface LoginRequest {
    username: string;
    password?: string;
    gRecaptchaResponse?: string;
}

export interface ApiResponse<T> {
    IsSuccess: boolean;
    Message: string;
    ResponseData: T;
}

export const AuthRepository = {
    login: async (credentials: LoginRequest): Promise<User> => {
        const response = await axiosInstance.post<ApiResponse<any>>(API_ENDPOINTS.AUTH.LOGIN, credentials);

        if (response.data.IsSuccess) {
            const data = response.data.ResponseData;
            // Map API response to Domain User Entity
            const user: User = {
                id: data.UserID,
                name: data.FullName,
                email: data.Email,
                roleId: data.RoleID,
                deptId: data.DeptID,
                token: data.AccessToken,
                privilege: data.employeePrivligesModel,
                lang: data.inslang === 'en' ? 'en' : 'ar',
            };

            // Store token locally as fallback
            localStorage.setItem('token', data.AccessToken);
            localStorage.setItem('lang', user.lang);

            return user;
        } else {
            throw new Error(response.data.Message || 'Login failed');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        // Implement any backend logout if specific API exists
    }
};
