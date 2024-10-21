'use client';

/**
 * Button to toggle the theme between light and dark mode.
 *
 * @example
 * <ThemeButton />
 */

import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa6';

import Button from '../ui/Button';
import { useEffect, useState } from 'react';

function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Button
      className="group"
      name={theme === 'dark' ? 'Light' : 'Dark'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <FaMoon name="light" size={20} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <FaSun name="dark" size={20} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
    </Button>
  );
}
export default ThemeButton;
