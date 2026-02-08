import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSheet } from './_sheet';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { date } = req.query;

    try {
        const doc = await getSheet();
        let sheet = doc.sheetsByTitle['Bookings'];

        if (!sheet) {
            sheet = await doc.addSheet({ title: 'Bookings', headerValues: ['date', 'name', 'mobile', 'description'] });
        }

        if (req.method === 'GET') {
            const rows = await sheet.getRows();
            const bookings = rows.map(row => ({
                date: row.get('date'),
                name: row.get('name'),
                mobile: row.get('mobile'),
                description: row.get('description'),
            }));
            return res.status(200).json(bookings);
        }

        else if (req.method === 'POST') {
            const { date, name, mobile, description } = req.body;

            // Check for existing booking
            const rows = await sheet.getRows();
            const existing = rows.find(row => row.get('date') === date);

            if (existing) {
                return res.status(409).json({ message: 'Date already booked' });
            }

            await sheet.addRow({ date, name, mobile, description });
            return res.status(201).json({ success: true });
        }

        else if (req.method === 'DELETE') {
            const { date } = req.body; // or query param
            const rows = await sheet.getRows();
            const row = rows.find(r => r.get('date') === date);

            if (row) {
                await row.delete();
                return res.status(200).json({ success: true });
            } else {
                return res.status(404).json({ message: 'Booking not found' });
            }
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
}
