import { v4 as uuidv4 } from 'uuid';

interface CustomToken {
    token: string;
    expiresAt: number;
}

export const generateCustomToken = (): CustomToken => {
    const token = uuidv4();
    const expiresAt = Date.now() + (20 * 60 * 60 * 1000); // 20 hours in milliseconds
    
    return {
        token,
        expiresAt
    };
};