import { supabase } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  country?: string;
}

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update player status to online
      if (data.user) {
        const { error: updateError } = await supabase
          .from('players')
          .update({
            status: 'online',
            last_login: new Date().toISOString(),
          })
          .eq('user_id', data.user.id);

        if (updateError) console.error('Failed to update player status:', updateError);
      }

      return data;
    },
    onSuccess: () => {
      message.success('Welcome back, Warlord!');
      router.push('/admin/dashboard');
    },
    onError: (error: any) => {
      message.error(error.message || 'Login failed. Check your credentials.');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ username, email, password, country }: RegisterData) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) throw authError;

      // Create player profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('players')
          .insert([{
            user_id: authData.user.id,
            username,
            email,
            country: country || null,
            status: 'online',
            registration_date: new Date().toISOString(),
            level: 1,
            power: 0,
            victory_points: 0,
            win_rate: 0,
            battles: 0,
            wins: 0,
            territory: 0,
            violations: 0,
          }]);

        if (profileError) throw profileError;
      }

      return authData;
    },
    onSuccess: () => {
      message.success('Account created successfully! Welcome to 12 Warlords.');
      router.push('/admin/dashboard');
    },
    onError: (error: any) => {
      message.error(error.message || 'Registration failed. Please try again.');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      message.success('Password reset email sent! Check your inbox.');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to send reset email.');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Get current user before logout
      const { data: { user } } = await supabase.auth.getUser();

      // Update player status to offline
      if (user) {
        await supabase
          .from('players')
          .update({ status: 'offline' })
          .eq('user_id', user.id);
      }

      // Sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      message.info('You have been logged out.');
      router.push('/login');
    },
    onError: (error: any) => {
      message.error(error.message || 'Logout failed.');
    },
  });
};
