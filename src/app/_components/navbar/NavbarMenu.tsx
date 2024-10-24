'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TbCardsFilled } from 'react-icons/tb';
import { FaCaretDown, FaDog, FaHorse, FaMusic, FaWandMagicSparkles } from 'react-icons/fa6';
import StyledLink from '../ui/StyledLink';
import Image from 'next/image';
import { type Session } from 'next-auth';
import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import ThemeButton from './themeButton';

type NavbarMenuProps = {
  session: Session | null;
};

export default function NavbarMenu({ session }: NavbarMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="pointer-events-auto relative flex flex-col">
      <div className="flex flex-col gap-2">
        <StyledLink href="/dungeons" className="group p-1">
          <Image
            src="/sources/Dungeon.png"
            alt="Dungeon"
            width={44}
            height={44}
            className="duration transition-200 object-fill ease-in-out group-hover:contrast-125"
          />
        </StyledLink>
        <StyledLink href="/raids" className="group p-1">
          <Image
            src="/sources/Raid.png"
            alt="Raid"
            width={44}
            height={44}
            className="duration transition-200 object-fill ease-in-out group-hover:contrast-125"
          />
        </StyledLink>
        <StyledLink href="/trials" className="group p-1">
          <Image
            src="/sources/Trial.png"
            alt="Trial"
            width={44}
            height={44}
            className="duration transition-200 object-fill ease-in-out group-hover:contrast-125"
          />
        </StyledLink>
        <StyledLink href="/variants" className="group p-1">
          <Image
            src="/sources/V&C Dungeon.png"
            alt="V&C Dungeon"
            width={44}
            height={44}
            className="duration transition-200 object-fill ease-in-out group-hover:contrast-125"
          />
        </StyledLink>
        <button
          className="flex flex-row items-center justify-center gap-2 whitespace-nowrap text-nowrap rounded-xl p-4 font-semibold backdrop-blur-md transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-stone-900 active:scale-x-110 active:bg-cyan-300 active:duration-100 dark:hover:bg-cyan-700 dark:hover:text-stone-100 dark:active:bg-cyan-700"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onClick={toggleMenu}
          aria-label="Expand menu">
          <FaCaretDown size={20} />
        </button>
      </div>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`flex flex-col gap-2 overflow-hidden py-2 transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <StyledLink href="/minions">
          <FaDog size={20} />
        </StyledLink>
        <StyledLink href="/mounts">
          <FaHorse size={20} />
        </StyledLink>
        <StyledLink href="/cards">
          <TbCardsFilled size={20} />
        </StyledLink>
        <StyledLink href="/orchestrions">
          <FaMusic size={20} />
        </StyledLink>
        <StyledLink href="/spells">
          <FaWandMagicSparkles size={20} />
        </StyledLink>
        <hr className="border-stone-700 dark:border-stone-200" />
        {session ? <SignOutButton /> : <SignInButton />}
        <ThemeButton />
      </div>
    </div>
  );
}
