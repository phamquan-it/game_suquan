import React from 'react';
import AuthLayoutClient from './AuthLayoutClient';

export const metadata = {
  title: '12 Warlords - Authentication',
  description: 'Login or register to enter the realm of 12 Warlords',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
