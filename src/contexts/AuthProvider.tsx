import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRoles } from '@/constants';

type AuthContextValue = {
  user: { id: string; email?: string; role?: string } | null;
  loading: boolean;
  isAdmin: boolean;
  // ...other fields if present...
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role,phone')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load profile:', error);
      }

      const rawRole = profile?.role || 'customer';
      const role = rawRole.toLowerCase() === 'customer' ? 'client' : rawRole.toLowerCase();

      setUser({
        id: session.user.id,
        email: session.user.email ?? undefined,
        role,
        // phoneVerified: Boolean(profile?.phone && profile?.phone_verified),
      });

      setLoading(false);
    };

    loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });
    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAdmin: user?.role === UserRoles.ADMIN,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
