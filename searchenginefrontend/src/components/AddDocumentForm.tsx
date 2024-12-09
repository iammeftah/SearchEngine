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
        <div className="min-h-screen bg-white dark:bg-black">
            <form className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="bg-neutral-200 dark:bg-neutral-900 p-4 rounded-2xl">
                    <div className="flex items-center justify-between gap-4 mb-8 text-neutral-400 rounded-lg px-4 py-1 bg-white dark:bg-black">
                        <div className="flex flex-row gap-4 ">
                            <button
                                type="button"
                                className="outline-none text-sm hover:text-neutral-300"
                                onClick={() => handleFormatting('bold')}
                            >
                                Bold
                            </button>
                            <button
                                type="button"
                                className="outline-none text-sm hover:text-neutral-300"
                                onClick={() => handleFormatting('italic')}
                            >
                                Italic
                            </button>
                            <button
                                type="button"
                                className="outline-none text-sm hover:text-neutral-300"
                                onClick={() => handleFormatting('underline')}
                            >
                                Underline
                            </button>
                        </div>
                        <button
                            type="button"
                            className="outline-none text-sm hover:text-neutral-300"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>

                    <div className="px-2">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Untitled"
                            className="w-full text-4xl font-bold mb-4 bg-transparent border-none outline-none placeholder-neutral-500 text-neutral-900 dark:text-neutral-100 caret-neutral-600 dark:caret-neutral-300"
                        />
                    </div>

                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleContentChange}
                        className=" px-2 min-h-[calc(100vh-200px)] outline-none text-neutral-900 dark:text-neutral-100 text-lg caret-neutral-600 dark:caret-neutral-300"
                    />

                    {isSaving && (
                        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-black rounded-lg shadow-xl p-4 w-80 border border-neutral-200 dark:border-[#404040]">
                            <p className="text-neutral-500 dark:text-neutral-400">Saving document...</p>
                        </div>
                    )}

                </div>
            </form>
        </div>
    );
};

export default AddDocumentForm;