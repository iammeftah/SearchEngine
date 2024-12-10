import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import AddDocumentForm from '../components/AddDocumentForm';
import Loader from '../components/Loader';

const AddDocumentPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a delay to show the loader
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            <Header />
            {isLoading ? (
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <Loader />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 lg:px-8 "
                >
                    <AddDocumentForm />
                </motion.div>
            )}
        </div>
    );
};

export default AddDocumentPage;