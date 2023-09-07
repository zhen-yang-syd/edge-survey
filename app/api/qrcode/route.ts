import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";
import { NEXT_QR_API_KEY, BASE_URL } from '@/utils';
import axios from 'axios';

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { surveyId, imageUrl } = body
    const data = await axios.post('https://api.qr.io/v1/create', JSON.stringify({
        "apikey": "V69JS1WY08vEXK5eUmir",
        "data": "https://www.edgecademy.org",
        "transparent": "off",
        "backcolor": "#033895",
        "frontcolor": "#ffffff",
        "marker_out_color": "#669df4",
        "marker_in_color": "#669df4",
        "pattern": "oriental",
        "marker": "flower",
        "marker_in": "circle",
        "optionlogo": "https://cdn.sanity.io/images/er52rfe6/production/2d919dd0e2bf59d69e48ec04e15657bad6fff3c3-1280x1706.jpg"
    }))

    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}