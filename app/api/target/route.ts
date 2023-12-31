import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";
import v4 from 'uuidv4'

export async function GET(req: NextRequest) {
    const query = `*[_type == "target"]`
    const data = await client.fetch(query)
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}
export async function POST(req: NextRequest) {
    const target = await req.json()
    const { name } = target
    const data = await client.create({
        _type: 'target',
        name: name,
        createdAt: new Date().toISOString(),
    })
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}