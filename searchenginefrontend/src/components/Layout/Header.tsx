import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DarkModeToggle from '../DarkModeToggler';

const Header: React.FC = () => {
    return (
        <motion.header
            className="bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-2">
                    <Link to="/" className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                        <span className="text-rose-500">C</span>hapronRouge<span className="text-rose-500">.</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 px-3 py-2 rounded-md text-sm md:text-base font-medium">
                            Home
                        </Link>
                        <Link to="/add" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 px-3 py-2 rounded-md text-sm md:text-base font-medium">
                            Add Document
                        </Link>
                        <DarkModeToggle />
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}

export default Header;