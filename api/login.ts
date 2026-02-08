import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSheet } from './_sheet.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    try {
        const doc = await getSheet();
        const sheet = doc.sheetsByTitle['Users'];

        if (!sheet) {
            return res.status(500).json({ message: 'Users sheet missing in Google Sheet' });
        }

        const rows = await sheet.getRows();
        const user = rows.find(row => row.get('username') === username && row.get('password') === password);

        if (user) {
            return res.status(200).json({ success: true, username });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal server error',
            error: String(error)
        });
    }
}
