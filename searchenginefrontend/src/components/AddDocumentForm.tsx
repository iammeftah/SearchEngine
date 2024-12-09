import React, { useState, useRef } from 'react';
import { addDocument } from '../api';

const AddDocumentForm: React.FC = () => {
    const [title, setTitle] = useState('Untitled');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        setContent(e.currentTarget.innerText);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await addDocument(title, content);
            setTitle('Untitled');
            setContent('');
            if (editorRef.current) editorRef.current.textContent = '';
        } catch (error) {
            console.error('Error saving document:', error);
        }
        setIsSaving(false);
    };

    const handleFormatting = (format: 'bold' | 'italic' | 'underline') => {
        if (editorRef.current) {
            document.execCommand(format, false, '');
            editorRef.current.focus();
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#1F1F1F]">
            <form className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-8 text-neutral-400">
                    <button
                        type="button"
                        className="text-sm hover:text-neutral-300"
                        onClick={() => handleFormatting('bold')}
                    >
                        Bold
                    </button>
                    <button
                        type="button"
                        className="text-sm hover:text-neutral-300"
                        onClick={() => handleFormatting('italic')}
                    >
                        Italic
                    </button>
                    <button
                        type="button"
                        className="text-sm hover:text-neutral-300"
                        onClick={() => handleFormatting('underline')}
                    >
                        Underline
                    </button>
                    <button
                        type="button"
                        className="text-sm hover:text-neutral-300"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>

                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled"
                    className="w-full text-4xl font-bold mb-4 bg-transparent border-none outline-none placeholder-neutral-500 text-neutral-900 dark:text-neutral-100"
                />

                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleContentChange}
                    className="min-h-[calc(100vh-200px)] outline-none text-neutral-900 dark:text-neutral-100 text-lg"
                />

                {isSaving && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#2F2F2F] rounded-lg shadow-xl p-4 w-80 border border-neutral-200 dark:border-[#404040]">
                        <p className="text-neutral-500 dark:text-neutral-400">Saving document...</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddDocumentForm;