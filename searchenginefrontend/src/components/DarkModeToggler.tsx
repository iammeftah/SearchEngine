import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

const DarkModeToggle: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(current => {
            if (current === 'light') return 'dark';
            if (current === 'dark') return 'system';
            return 'light';
        });
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className="p-2 outline-none border-none rounded-full"
            whileTap={{ scale: 0.95 }}
        >
            {theme === 'light' && <Sun size={24} />}
            {theme === 'dark' && <Moon size={24} />}
            {theme === 'system' && <Laptop size={24} />}
        </motion.button>
    );
};

export default DarkModeToggle;

