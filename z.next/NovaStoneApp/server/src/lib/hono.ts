import { Hono } from "hono";

export type AuthVariables = {
  userId: string;
  userEmail: string;
  userName: string;
  jwtPayload: unknown;
};

export type AppType = { Variables: AuthVariables };

export const createApp = () => new Hono<AppType>();
