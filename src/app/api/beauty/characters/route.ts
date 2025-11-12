import { NextRequest, NextResponse } from 'next/server';

// Mock data - trong thực tế sẽ kết nối database
const mockCharacters = [
    {
        id: '1',
        name: 'Tây Thi',
        title: 'Trầm ngư lạc nhạn',
        rarity: 'legendary',
        level: 85,
        charm: 95,
        intelligence: 88,
        diplomacy: 82,
        intrigue: 90,
        loyalty: 85,
        status: 'available',
    },
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const rarity = searchParams.get('rarity');
    const status = searchParams.get('status');

    let filteredCharacters = mockCharacters;

    if (rarity) {
        filteredCharacters = filteredCharacters.filter(char => char.rarity === rarity);
    }

    if (status) {
        filteredCharacters = filteredCharacters.filter(char => char.status === status);
    }

    return NextResponse.json({
        success: true,
        data: filteredCharacters,
        total: filteredCharacters.length,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const required = ['name', 'title', 'rarity'];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new character (trong thực tế sẽ insert vào database)
        const newCharacter = {
            id: Math.random().toString(36).substr(2, 9),
            ...body,
            level: 1,
            experience: 0,
            status: 'available',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            data: newCharacter,
            message: 'Character created successfully',
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Invalid JSON body' },
            { status: 400 }
        );
    }
}
