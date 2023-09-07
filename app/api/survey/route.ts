import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function GET(req: NextRequest) {
    const query = `*[_type == "survey"] {
        _id,
        title,
        target->{
            name,
        },
        image {
            asset->{
                url,
            }
        },
        questions[]->{
            title,
            required,
            type,
            options[],
        },
        qrCode {
            asset->{
                url,
            }
        },
        createdAt,
        logo {
            asset->{
                url,
            }
        }
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
    const { title, target, image, questions, logo } = surveyObject
    const data = await client.create({
        _type: 'survey',
        title: title,
        target: {
            _type: 'reference',
            _ref: target,
        },
        image: {
            _type: 'image',
            asset: {
                _type: "reference",
                _ref: image,
            }
        },
        logo: {
            _type: 'image',
            asset: {
                _type: "reference",
                _ref: logo,
            }
        },
        questions: questions,
        createdAt: new Date().toISOString(),
    })
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}