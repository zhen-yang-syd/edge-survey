import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";
import v4 from 'uuidv4'

export async function GET(req: NextRequest) {
    const query = `*[_type == "pair"]`
    const data = await client.fetch(query)
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}
export async function POST(req: NextRequest) {
    const pair = await req.json()
    const { question, answer } = pair
    const data = await client.create({
        _type: 'pair',
        question: question,
        answer: answer,
        createdAt: new Date().toISOString(),
    })
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}