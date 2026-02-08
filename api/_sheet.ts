import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// 1. Get credentials from Vercel Environment Variables
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const KEY = process.env.GOOGLE_PRIVATE_KEY;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function getSheet() {
    // 2. Fail fast if credentials are missing
    if (!SERVICE_ACCOUNT_EMAIL || !KEY || !SHEET_ID) {
        throw new Error('Missing Google Sheets credentials. Please add GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID to Vercel Environment Variables.');
    }

    // 3. Simple key handling: replace literal \n with real newlines
    const formattedKey = KEY.replace(/\\n/g, '\n');

    try {
        // 4. Create Auth Client
        const serviceAccountAuth = new JWT({
            email: SERVICE_ACCOUNT_EMAIL,
            key: formattedKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // 5. Initialize Sheet
        const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        return doc;
    } catch (error) {
        console.error('Google Sheets Connection Error:', error);
        // Throw detailed error to help debugging in Vercel logs
        throw new Error(`Failed to connect to Google Sheet: ${(error as Error).message}`);
    }
}
