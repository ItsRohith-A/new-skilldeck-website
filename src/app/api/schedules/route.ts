import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/apiProxy';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Use standard fetchFromBackend proxy wrapper
        const response = await fetchFromBackend("/schedules", {
            request,
            queryParams: searchParams,
            prefix: "/api/v1/skilldeck",
            next: { tags: ['schedules'] }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Backend API responded with ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('API Proxy Error (Schedules):', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
