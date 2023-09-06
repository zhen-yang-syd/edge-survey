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
        edgeGroup,
        edgeExperience,
        edgeInterested,
        createdAt,
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