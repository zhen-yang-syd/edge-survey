import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function POST(req: NextRequest) {
    const surveyObject = await req.json()
    const { _id, title, target, image, questions, logo } = surveyObject
    // const data = await client.create({
    //     _type: 'survey',
    //     title: title,
    //     target: {
    //         _type: 'reference',
    //         _ref: target,
    //     },
    //     image: {
    //         _type: 'image',
    //         asset: {
    //             _type: "reference",
    //             _ref: image,
    //         }
    //     },
    //     logo: {
    //         _type: 'image',
    //         asset: {
    //             _type: "reference",
    //             _ref: logo,
    //         }
    //     },
    //     questions: questions,
    //     createdAt: new Date().toISOString(),
    // })
    const data = await client.patch(_id).set({
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
    }).commit()
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}