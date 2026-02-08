import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSheet } from './_sheet';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const doc = await getSheet();
        const usersSheet = doc.sheetsByTitle['Users'];
        const bookingsSheet = doc.sheetsByTitle['Bookings'];

        return res.status(200).json({
            message: 'Connection Successful',
            sheetTitle: doc.title,
            sheets: {
                users: !!usersSheet,
                bookings: !!bookingsSheet
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Connection Failed',
            error: (error as Error).message
        });
    }
}
