import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function POST(req: NextRequest) {
    const qrCode = await req.json()
    const { qrCodeUrl, surveyId } = qrCode
    const data = await client.patch(surveyId).setIfMissing({ qrCode: '' }).set({
        qrCode: qrCodeUrl,
    }).commit()

    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}