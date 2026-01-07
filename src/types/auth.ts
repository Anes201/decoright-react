
export type Role = 'admin' | 'client';
export type User = { id: string; name?: string; email?: string; role: Role };

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
};