import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Helper to clean the key
function getCleanKey(key: string | undefined): string | undefined {
    if (!key) return undefined;

    // 1. Unescape literal \n
    let cleaned = key.replace(/\\n/g, '\n');

    // 2. Remove existing headers/footers to access raw base64
    cleaned = cleaned.replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '');

    // 3. Remove all whitespace (newlines, spaces)
    cleaned = cleaned.replace(/\s+/g, '');

    // 4. Rebuild cleanly with 64-char lines (standard PEM format)
    const chunkSize = 64;
    const body: string[] = [];
    for (let i = 0; i < cleaned.length; i += chunkSize) {
        body.push(cleaned.slice(i, i + chunkSize));
    }

    return `-----BEGIN PRIVATE KEY-----\n${body.join('\n')}\n-----END PRIVATE KEY-----\n`;
}

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const RAW_KEY = process.env.GOOGLE_PRIVATE_KEY;
const PRIVATE_KEY = getCleanKey(RAW_KEY);
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function getSheet() {
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SHEET_ID) {
        throw new Error('Google Sheets credentials missing');
    }

    try {
        const serviceAccountAuth = new JWT({
            email: SERVICE_ACCOUNT_EMAIL,
            key: PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        console.log('Google Sheet loaded successfully:', doc.title);
        return doc;
    } catch (error) {
        console.error('Google Sheets connection error:', error);
        throw error;
    }
}
