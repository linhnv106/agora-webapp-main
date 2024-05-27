'use client';

import { signIn, signOut } from 'next-auth/react';

export function SignInButton() {
  return (
    <button className="btn btn-primary" onClick={() => signIn()}>
      {'Sign in'}
    </button>
  );
}

export function SignOutButton() {
  const onSignOut = (): void => {
    signOut();
  };

  return <button onClick={onSignOut}>{'Sign out'}</button>;
}
