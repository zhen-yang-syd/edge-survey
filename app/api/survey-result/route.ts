import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    let surveyId = searchParams.get('surveyId')
    const query = `*[_type == "result" && survey._ref=="${surveyId}"] {
        username,
        email,
        phone,
        resultList[]->{
            question,
            answer[],
        },
        createdAt,
    }`
    const data = await client.fetch(query)
    return NextResponse.json({
        success: true,
        status: 200,
        message: "success",
        data: data,
    })
}