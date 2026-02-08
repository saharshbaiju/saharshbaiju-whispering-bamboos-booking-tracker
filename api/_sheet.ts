import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Helper to clean the key
function getCleanKey(key: string | undefined): string | undefined {
    if (!key) return undefined;
    // Handle both literal \n and string newlines
    let cleaned = key.replace(/\\n/g, '\n');

    // Ensure the key starts and ends correctly
    if (!cleaned.startsWith('-----BEGIN PRIVATE KEY-----')) {
        // sometimes people paste just the base64
        cleaned = `-----BEGIN PRIVATE KEY-----\n${cleaned}\n-----END PRIVATE KEY-----`;
    }

    return cleaned;
}

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const RAW_KEY = process.env.GOOGLE_PRIVATE_KEY;
const PRIVATE_KEY = getCleanKey(RAW_KEY);
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function getSheet() {
    console.log('Connecting to Google Sheets...');
    console.log('Email:', SERVICE_ACCOUNT_EMAIL);
    console.log('Sheet ID:', SHEET_ID);
    console.log('Private Key length:', PRIVATE_KEY?.length);
    console.log('Private Key start:', PRIVATE_KEY?.substring(0, 35));
    console.log('Private Key contains newlines:', PRIVATE_KEY?.includes('\n'));

    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SHEET_ID) {
        console.error('Missing credentials');
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
