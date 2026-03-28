import { apiFetch } from "@/lib/api";
import type { Role } from "@/types";

export const rolesService = {
  // Get all roles
  async getRoles(): Promise<Role[]> {
    return apiFetch<Role[]>("/api/roles", {}, "user");
  },
};
