import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDocument } from '../api';
import Header from '../components/Layout/Header';

interface Document {
    id?: string;
    title?: string;
    content?: string;
}

const DocumentPage: React.FC = () => {
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchDocument = async () => {
            if (id) {
                setIsLoading(true);
                try {
                    const doc = await getDocument(id);
                    if (doc) {
                        setDocument(doc);
                    } else {
                        console.error('Document not found');
                        // Optionally set an error state here
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
                setIsLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900 text-black dark:text-white">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-start py-24 px-4">
                <motion.div
                    className="w-full max-w-4xl z-10 bg-white/80 dark:bg-neutral-900/80 rounded-lg p-8 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isLoading ? (
                        <p className="text-center text-xl">Loading...</p>
                    ) : document ? (
                        <>
                            <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                {document.content?.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4">{paragraph}</p>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-xl">Document not found</p>
                    )}
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            to="/"
                            className="text-primary hover:text-primary-dark transition-colors duration-200"
                        >
                            ← Back to search
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default DocumentPage;

