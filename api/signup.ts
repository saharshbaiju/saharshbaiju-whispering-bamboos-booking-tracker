import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSheet } from './_sheet.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password || password.length < 4) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const doc = await getSheet();
        let sheet = doc.sheetsByTitle['Users'];

        if (!sheet) {
            return res.status(500).json({ message: 'Users sheet missing in Google Sheet' });
        }

        const rows = await sheet.getRows();
        const existing = rows.find(row => row.get('username').toLowerCase() === username.toLowerCase());

        if (existing) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        await sheet.addRow({ username, password });
        return res.status(201).json({ success: true, username });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : 'Internal server error',
            error: String(error)
        });
    }
}
