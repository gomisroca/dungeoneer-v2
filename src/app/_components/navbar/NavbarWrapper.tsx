import Link from 'next/link';
import React from 'react';
import { getServerAuthSession } from '@/server/auth';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import ThemeButton from './themeButton';

async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <div className="absolute left-0 right-0 top-0 flex flex-row items-start justify-between p-4">
      <Link
        href="/"
        className="rounded-xl p-3 text-xl font-bold backdrop-blur-sm transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-stone-900 dark:hover:bg-cyan-700 dark:hover:text-stone-100">
        dungeoneer
      </Link>
      {/* Basic Menu */}
      <div>
        <ThemeButton />
        {session ? <SignOutButton /> : <SignInButton />}
      </div>
    </div>
  );
}

export default Navbar;
