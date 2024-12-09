import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const SearchForm: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/results?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <motion.div
                    className="flex items-center"
                    initial={false}
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search..."
                        className="caret-neutral-500 dark:caret-white w-full bg-transparent border border-neutral-700 dark:border-neutral-400 hover:border-rose-300 dark:hover:border-rose-500 focus:border-rose-300 dark:focus:border-rose-500 rounded-full px-4 py-2 pl-10 pr-4 outline-none duration-300"
                    />
                    <motion.button
                        type="submit"
                        className="absolute outline-none border-none left-0 top-0 bottom-0 px-3 flex items-center justify-center"
                        whileTap={{ scale: 0.95 }}
                    >
                        <Search size={20} className="text-neutral-500 dark:text-neutral-300" />
                    </motion.button>
                </motion.div>
                <AnimatePresence>
                    {isFocused && query && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-md shadow-lg z-10"
                        >
                            <div className="p-2 text-sm text-neutral-700 dark:text-neutral-300">
                                Search suggestions will appear here...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}

export default SearchForm;

