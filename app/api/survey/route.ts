import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function GET(req: NextRequest) {
    const query = `*[_type == "survey"] {
        _id,
    }`
    const data = await client.fetch(query)
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}

export async function POST(req: NextRequest) {
    const surveyObject = await req.json()
    const { question, required, type, option } = surveyObject
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