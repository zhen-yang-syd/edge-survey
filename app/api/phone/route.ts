import { NextResponse, NextRequest } from 'next/server'
import { NEXT_TWILIO_AUTH_TOKEN, NEXT_TWILIO_SID, NEXT_TWILIO_MESSAGE_SERVICE_SID } from "@/utils";

export async function POST(req: NextRequest) {
    const user = await req.json()
    const { phone, code } = user
    const accountSid = NEXT_TWILIO_SID;
    const authToken = NEXT_TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const data = await client.messages
        .create({
            body: `Your verifycation code is ${code}`,
            from: '+61483926168',
            messagingServiceSid: NEXT_TWILIO_MESSAGE_SERVICE_SID,
            to: phone
        })
    if (data.errorCode) {
        return NextResponse.json({ status: 400, message: "SMS not sent", data: { send: false } })
    } else {
        return NextResponse.json({ status: 200, message: "SMS sent", data: { send: true } })
    }
}