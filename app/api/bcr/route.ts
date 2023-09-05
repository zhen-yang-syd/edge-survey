import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function GET(req: NextRequest) {
    const query = `*[_type == "bcrLanding"] {
        name,
        phone,
        email,
        major,
        experience,
        preferActivities[],
    }`
    const data = await client.fetch(query)
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}