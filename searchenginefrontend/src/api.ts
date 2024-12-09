interface Document {
    id: string;
    title: string;
    content: string;
    excerpt: string;
}

let documents: Document[] = [
    {
        id: '1',
        title: 'Sample Document',
        content: '<p>This is a sample document content.</p>',
        excerpt: 'This is a sample document content.',
    },
];

export async function searchDocuments(query: string): Promise<Document[]> {
    // Simple search implementation
    return documents.filter(
        (doc) =>
            doc.title.toLowerCase().includes(query.toLowerCase()) ||
            doc.content.toLowerCase().includes(query.toLowerCase())
    );
}

export async function getDocument(id: string): Promise<Document | undefined> {
    return documents.find((doc) => doc.id === id);
}

export async function addDocument(title: string, content: string): Promise<Document> {
    const newDoc: Document = {
        id: (documents.length + 1).toString(),
        title,
        content,
        excerpt: content.slice(0, 100) + '...',
    };
    documents.push(newDoc);
    return newDoc;
}

