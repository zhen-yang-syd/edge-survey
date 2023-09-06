import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";
import v4 from 'uuidv4'

export async function GET(req: NextRequest) {
    const query = `*[_type == "question"]`
    const data = await client.fetch(query)
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}
export async function POST(req: NextRequest) {
    const questionObject = await req.json()
    const { question, required, type, option } = questionObject
    const data = await client.create({
        _type: 'question',
        title: question,
        required: required,
        type: type,
        options: option,
        createdAt: new Date().toISOString(),
    })
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}