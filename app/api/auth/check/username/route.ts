import { NextResponse } from 'next/server'
import { client } from "@/utils/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    let username = searchParams.get('username')
    let surveyId = searchParams.get('surveyId')
    if (username?.length === 9) {
        username = `0${username}`
    }
    const query = `*[_type == "result" && survey._ref == "${surveyId}"]{
        phone
    }`;
    const res = await client.fetch(query);
    const isContained = res.some(
        (obj: { [s: string]: unknown } | ArrayLike<unknown>) =>
            Object.values(obj).some(
                (val) => typeof val === "string" && val.includes(username as string)
            )
    );
    if (isContained) {
        return NextResponse.json({
            status: 200,
            message: "Username is founded in database",
            data: { available: false },
        })
    }
    else {
        return NextResponse.json({
            status: 200,
            message: "Username is not founded in database",
            data: { available: true },
        })
    }
}