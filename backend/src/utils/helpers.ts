export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const sanitizeString = (str: string): string => {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
};

export const generateSlug = (str: string): string => {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};