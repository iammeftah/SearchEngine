import React, { useState, useRef, useCallback } from 'react';
import { addDocument } from '../api';
import { Bold, Italic, Underline, Save, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, ChevronDown } from 'lucide-react';
import Loader from './Loader';

const AddDocumentForm: React.FC = () => {
    const [title, setTitle] = useState('Untitled');
    const [isSaving, setIsSaving] = useState(false);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
    const [showListOptions, setShowListOptions] = useState(false);
    const [showFontSizes, setShowFontSizes] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    const updateActiveFormats = useCallback(() => {
        const newActiveFormats = new Set<string>();
        if (document.queryCommandState('bold')) newActiveFormats.add('bold');
        if (document.queryCommandState('italic')) newActiveFormats.add('italic');
        if (document.queryCommandState('underline')) newActiveFormats.add('underline');
        if (document.queryCommandState('justifyLeft')) newActiveFormats.add('alignLeft');
        if (document.queryCommandState('justifyCenter')) newActiveFormats.add('alignCenter');
        if (document.queryCommandState('justifyRight')) newActiveFormats.add('alignRight');
        if (document.queryCommandState('insertOrderedList')) newActiveFormats.add('orderedList');
        if (document.queryCommandState('insertUnorderedList')) newActiveFormats.add('unorderedList');
        setActiveFormats(newActiveFormats);
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = useCallback(() => {
        updateActiveFormats();
    }, [updateActiveFormats]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await addDocument(title, editorRef.current?.innerHTML || '');
            setTitle('Untitled');
            if (editorRef.current) editorRef.current.innerHTML = '';
        } catch (error) {
            console.error('Error saving document:', error);
        }
        setIsSaving(false);
    };

    const formatList = (listType: string) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        // Find the closest list container to the current selection
        const listContainer = range.commonAncestorContainer.parentElement?.closest('ol, ul');

        // If we're already in a list, we need to handle the transformation
        if (listContainer) {
            // Only transform the current list, not all lists in the document
            if (listType === 'bullet') {
                // Convert to unordered list while preserving content
                const newList = document.createElement('ul');
                Array.from(listContainer.children).forEach(item => {
                    const newItem = document.createElement('li');
                    newItem.innerHTML = item.innerHTML;
                    newList.appendChild(newItem);
                });
                listContainer.parentNode?.replaceChild(newList, listContainer);
            } else {
                // Convert to ordered list with specific style
                const newList = document.createElement('ol');
                Array.from(listContainer.children).forEach(item => {
                    const newItem = document.createElement('li');
                    newItem.innerHTML = item.innerHTML;
                    newList.appendChild(newItem);
                });

                // Apply the specific list style
                switch (listType) {
                    case 'decimal':
                        newList.style.listStyleType = 'decimal';
                        break;
                    case 'alpha':
                        newList.style.listStyleType = 'lower-alpha';
                        break;
                    case 'roman':
                        newList.style.listStyleType = 'lower-roman';
                        break;
                }

                listContainer.parentNode?.replaceChild(newList, listContainer);
            }
        } else {
            // If we're not in a list, create a new one
            if (listType === 'bullet') {
                document.execCommand('insertUnorderedList', false, '');
            } else {
                document.execCommand('insertOrderedList', false, '');
                const newList = selection.getRangeAt(0).commonAncestorContainer.parentElement?.closest('ol');
                if (newList) {
                    switch (listType) {
                        case 'decimal':
                            newList.style.listStyleType = 'decimal';
                            break;
                        case 'alpha':
                            newList.style.listStyleType = 'lower-alpha';
                            break;
                        case 'roman':
                            newList.style.listStyleType = 'lower-roman';
                            break;
                    }
                }
            }
        }
    };

    const handleFormatting = useCallback((format: string) => {
        if (editorRef.current) {
            editorRef.current.focus();

            switch (format) {
                case 'bold':
                case 'italic':
                case 'underline':
                    document.execCommand(format, false, '');
                    break;
                case 'alignLeft':
                case 'alignCenter':
                case 'alignRight':
                    document.execCommand('justify' + format.slice(5), false, '');
                    break;
                case 'heading-1':
                    document.execCommand('formatBlock', false, '<h1>');
                    break;
                case 'heading-2':
                    document.execCommand('formatBlock', false, '<h2>');
                    break;
                case 'heading-3':
                    document.execCommand('formatBlock', false, '<h3>');
                    break;
                case 'list-decimal':
                case 'list-alpha':
                case 'list-roman':
                case 'list-bullet':
                    formatList(format.split('-')[1]);
                    break;
                case 'fontSize-1':
                    document.execCommand('fontSize', false, '2'); // Small
                    break;
                case 'fontSize-2':
                    document.execCommand('fontSize', false, '3'); // Normal
                    break;
                case 'fontSize-3':
                    document.execCommand('fontSize', false, '5'); // Large
                    break;
                case 'fontSize-4':
                    document.execCommand('fontSize', false, '7'); // Extra Large
                    break;
            }
            updateActiveFormats();
        }
    }, [updateActiveFormats]);

    const isFormatActive = useCallback((format: string) => {
        return activeFormats.has(format);
    }, [activeFormats]);

    // Dropdown components
    const ListOptionsDropdown = () => (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowListOptions(!showListOptions);
                    setShowFontSizes(false);
                }}
                className="flex items-center gap-1 p-2 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
                <ListOrdered size={16} />
                <ChevronDown size={12} />
            </button>
            {showListOptions && (
                <div className="absolute z-50 w-32 mt-1 bg-white dark:bg-neutral-800 rounded shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <button
                        className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            formatList('decimal');
                            setShowListOptions(false);
                        }}
                    >
                        1, 2, 3
                    </button>
                    <button
                        className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            formatList('alpha');
                            setShowListOptions(false);
                        }}
                    >
                        a, b, c
                    </button>
                    <button
                        className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        onClick={() => {
                            formatList('roman');
                            setShowListOptions(false);
                        }}
                    >
                        i, ii, iii
                    </button>
                </div>
            )}
        </div>
    );

    const FontSizeDropdown = () => (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowFontSizes(!showFontSizes);
                    setShowListOptions(false);
                }}
                className="outline-none flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
                <span className="font-bold">T</span>
                <ChevronDown size={12} />
            </button>
            {showFontSizes && (
                <div className="absolute z-50 w-32 mt-1 bg-white dark:bg-neutral-800 rounded shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <button
                        className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-1');
                            setShowFontSizes(false);
                        }}
                    >
                        Small
                    </button>
                    <button
                        className="w-full px-3 py-2 text-base text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-2');
                            setShowFontSizes(false);
                        }}
                    >
                        Normal
                    </button>
                    <button
                        className="w-full px-3 py-2 text-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-3');
                            setShowFontSizes(false);
                        }}
                    >
                        Large
                    </button>
                    <button
                        className="w-full px-3 py-2 text-xl text-left hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        onClick={() => {
                            handleFormatting('fontSize-4');
                            setShowFontSizes(false);
                        }}
                    >
                        Extra Large
                    </button>
                </div>
            )}
        </div>
    );

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            setShowListOptions(false);
            setShowFontSizes(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <form className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
                    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 mb-8 text-gray-600 dark:text-gray-300 rounded-lg px-4 py-2 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                            {[
                                { icon: () => <span className="font-bold w-8">H1</span>, format: 'heading-1', label: 'Heading 1' },
                                { icon: () => <span className="font-bold w-8">H2</span>, format: 'heading-2', label: 'Heading 2' },
                                { icon: () => <span className="font-bold w-8">H3</span>, format: 'heading-3', label: 'Heading 3' },
                                { icon: Bold, format: 'bold', label: 'Bold' },
                                { icon: Italic, format: 'italic', label: 'Italic' },
                                { icon: Underline, format: 'underline', label: 'Underline' },
                                { icon: AlignLeft, format: 'alignLeft', label: 'Align Left' },
                                { icon: AlignCenter, format: 'alignCenter', label: 'Align Center' },
                                { icon: AlignRight, format: 'alignRight', label: 'Align Right' },
                                { icon: List, format: 'list-bullet', label: 'Bullet List' },
                            ].map(({ icon: Icon, format, label }) => (
                                <button
                                    key={format}
                                    type="button"
                                    className={`h-8 w-8 flex items-center justify-center rounded transition-colors ${
                                        isFormatActive(format)
                                            ? 'bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900'
                                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                    onClick={() => handleFormatting(format)}
                                    aria-label={label}
                                >
                                    <Icon size={16} />
                                </button>
                            ))}
                            <ListOptionsDropdown />
                            <FontSizeDropdown />
                        </div>
                        <div /> {/* Spacer */}
                        <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                            onClick={handleSave}
                        >
                            <Save size={16} />
                            <span>Save</span>
                        </button>
                    </div>

                    <div className="px-2">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Untitled"
                            className="w-full text-4xl font-bold mb-4 bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleContentChange}
                        onKeyUp={updateActiveFormats}
                        onMouseUp={updateActiveFormats}
                        className="px-6 min-h-[calc(100vh-200px)] outline-none text-gray-900 dark:text-gray-100 prose dark:prose-invert prose-lg max-w-none caret-gray-900 dark:caret-gray-100
                            [&>*]:mb-4
                            [&>p]:leading-relaxed
                            [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:leading-tight
                            [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:leading-tight
                            [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:leading-tight
                            [&>ol]:list-decimal [&>ul]:list-disc
                            [&>ol,&>ul]:pl-8 [&>ol,&>ul]:mb-4
                            [&>ol>li,&>ul>li]:pl-4 [&>ol>li,&>ul>li]:mb-2
                            [&>ol>li::marker,&>ul>li::marker]:text-gray-500
                            [&>ol>li::marker]:mr-4
                            [&>ul>li::marker]:mr-4
                            [&>ol]:relative [&>ul]:relative
                            [&>ol]:before:absolute [&>ol]:before:left-0 [&>ol]:before:top-0 [&>ol]:before:bottom-0 [&>ol]:before:w-8
                            [&>ul]:before:absolute [&>ul]:before:left-0 [&>ul]:before:top-0 [&>ul]:before:bottom-0 [&>ul]:before:w-8
                            [&>font[size='7']]:text-4xl
                            [&>font[size='5']]:text-2xl
                            [&>font[size='3']]:text-lg
                            [&>font[size='2']]:text-base"
                    />

                    {isSaving && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center">
                            <Loader />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddDocumentForm;