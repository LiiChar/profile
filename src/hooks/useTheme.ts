'use client';

import { LOCAL_STORAGE_THEME_KEY } from "@/const/theme";
import { useEffect, useState } from "react";

export const useTheme = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
      const currentTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      if (currentTheme) {
        setTheme(currentTheme as 'light' | 'dark');
      }
  }, []);

  const changeTheme = (theme: 'light' | 'dark') => {
    const body = document.body;

    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }

    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    setTheme(theme);
  };

  return [theme, changeTheme]
};