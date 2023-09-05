import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function POST(req: NextRequest) {
    const questionaire = await req.json()
    const data = await client.create(questionaire).then((res) => {
        console.log(`Questionaire was created, document ID is ${res._id}`)
    }).catch((err) => {
        console.error('Oh no, the update failed: ', err.message)
    })
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: questionaire,
    })
}