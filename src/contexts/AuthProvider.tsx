import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { userRoles } from '@/constants';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type AuthContextValue = {
  user: { id: string; email?: string; role?: string; phoneVerified?: boolean } | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation()

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
        toast.error(t('error_load'))
      }

      const role = profile?.role?.toLowerCase() || "customer";
      setUser({
        id: session.user.id,
        email: session.user.email ?? undefined,
        role,
        phoneVerified: !!user?.phone_verified,
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
    isAdmin: user?.role === userRoles.ADMIN || user?.role === userRoles.SUPER_ADMIN,
    isSuperAdmin: user?.role === userRoles.SUPER_ADMIN,
  };

  return <AuthContext.Provider value={value}> { children } </AuthContext.Provider>;
}
