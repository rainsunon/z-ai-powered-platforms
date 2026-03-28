import { apiFetch, buildQueryParams, type Page } from "@/lib/api";
import type { User, UserDetails, UserFilter, Department } from "@/types";

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roleId: number;
  departmentId?: number;
  phone?: string;
  hireDate?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
}

export const usersService = {
  // Get all users with pagination and filters
  async getUsers(
    page = 0,
    size = 10,
    filter?: UserFilter
  ): Promise<Page<User>> {
    const query = buildQueryParams({
      page,
      size,
      search: filter?.search,
      role: filter?.role,
      departmentId: filter?.departmentId,
    });
    return apiFetch<Page<User>>(`/api/users${query}`, {}, "user");
  },

  // Get user by ID
  async getUser(id: number): Promise<User> {
    return apiFetch<User>(`/api/users/${id}`, {}, "user");
  },

  // Get user details (ADMIN only)
  async getUserDetails(id: number): Promise<UserDetails> {
    return apiFetch<UserDetails>(`/api/users/details/${id}`, {}, "user");
  },

  // Get user by email (for auth)
  async getUserByEmail(email: string): Promise<User> {
    return apiFetch<User>(
      `/api/users/by-email?email=${encodeURIComponent(email)}`,
      {},
      "user"
    );
  },

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    return apiFetch<UserStats>("/api/users/stats", {}, "user");
  },

  // Create user
  async createUser(data: CreateUserData): Promise<User> {
    return apiFetch<User>(
      "/api/users",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "user"
    );
  },

  // Get all departments
  async getDepartments(): Promise<Department[]> {
    return apiFetch<Department[]>("/api/departments", {}, "user");
  },

  // Get department by ID
  async getDepartment(id: number): Promise<Department> {
    return apiFetch<Department>(`/api/departments/${id}`, {}, "user");
  },

  // Get users by department (for managers)
  async getUsersByDepartment(departmentId: number): Promise<User[]> {
    return apiFetch<User[]>(
      `/api/users?departmentId=${departmentId}`,
      {},
      "user"
    );
  },
};
