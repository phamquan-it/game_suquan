'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

interface LoginValues {
  email: string;
  password: string;
}

interface ForgotPasswordValues {
  email: string;
}

interface RegisterValues {
  email: string;
  password: string;
  fullName?: string;
}

export function useLogin() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = async (values: LoginValues) => {
    setIsPending(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log("login success")
      if (error) {
        setError(error.message);
        throw error;
      }

      return data;
    } catch (err: any) {
      console.log("login err")
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

export function useForgotPassword() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendResetEmail = async (values: ForgotPasswordValues) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        throw error;
      }
      setSuccess('Password reset email sent. Check your inbox.');
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { sendResetEmail, isPending, error, success };
}

export function useRegister() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerUser = async (values: RegisterValues) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName || '',
          },
        },
      });

      if (error) {
        setError(error.message);
        throw error;
      }

      setSuccess('Registration successful! Please check your email to confirm.');
      return data;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { registerUser, isPending, error, success };
}

export function useLogout() {

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Optional: clear localStorage / Redux
      //     localStorage.removeItem('supabase.auth.token');
      // dispatch(logoutUser()) // nếu dùng Redux
      return true;
    },
    onSuccess: () => {
      message.success('Logout successful!');
    },
    onError: (err: any) => {
      console.error('Logout failed:', err);
    },
  });

  return mutation;
}
