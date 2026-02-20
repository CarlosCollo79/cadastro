import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET() {
    try {
        const client = await db.query.clients.findFirst();
        return NextResponse.json({
            status: 'success',
            message: 'Connected to DB successfully',
            data: client
        });
    } catch (error) {
        console.error('DB Test Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to DB',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
