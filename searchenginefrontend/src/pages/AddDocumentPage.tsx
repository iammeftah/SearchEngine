import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import AddDocumentForm from '../components/AddDocumentForm';

const AddDocumentPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#191919]">
            <Header />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-20" // Add this line to create some space between the header and the form
            >
                <AddDocumentForm />
            </motion.div>
        </div>
    );
};

export default AddDocumentPage;