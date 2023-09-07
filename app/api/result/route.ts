import { NextResponse, NextRequest } from 'next/server'
import { client } from "@/utils/client";

export async function GET(req: NextRequest) {
    const query = `*[_type == "contestDemo"] {
        _id,
        user->{
            name,
            phoneNumber,
            email,
        },
        createdAt,
        edgeGroup,
        edgeExperience,
        edgeInterested,
    }`
    const data = await client.fetch(query)
    let list:any = []
    const result = data.map((item:any) => {
        if (item.createdAt.slice(0,10) === '2023-09-06') {
            list.push({
                name:item.user.name,
                phone:item.user.phoneNumber,
                email:item.user.email,
                edgeGroup: item.edgeGroup,
                edgeExperience: item.edgeExperience,
                edgeInterested: item.edgeInterested,
                createdAt: item.createdAt,
            })
        }
    })
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: list,
    })
}
export async function POST(req: NextRequest) {
    const result = await req.json()
    const { survey, username, email,  phone, resultList} = result
    const data = await client.create({
        _type: 'result',
        survey: survey,
        username: username,
        email: email,
        phone: phone,
        resultList: resultList,
        createdAt: new Date().toISOString(),
    })
    return NextResponse.json({
        success: true,
        status: 200,
        message: "Success",
        data: data,
    })
}