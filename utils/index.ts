export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const NEXT_PUBLIC_SANITY_TOKEN =
    process.env.NEXT_PUBLIC_SANITY_TOKEN;
export const NEXT_PUBLIC_TOKEN_SECRET_KEY =
    process.env.NEXT_PUBLIC_TOKEN_SECRET_KEY;
export const NEXT_PUBLIC_PASSWORD_SECRET_KEY =
    process.env.NEXT_PUBLIC_PASSWORD_SECRET_KEY;
export const EMAIL_TOKEN_SECRET_KEY =
    process.env.NEXT_PUBLIC_EMAIL_TOKEN_SECRET_KEY;
export const NEXT_PUBLIC_EMAIL_TOKEN_SECRET_KEY_KYC =
    process.env.NEXT_PUBLIC_EMAIL_TOKEN_SECRET_KEY_KYC;
export const NEXT_PUBLIC_SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY;
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const NEXT_TWILIO_SID = process.env.NEXT_TWILIO_SID;
export const NEXT_TWILIO_AUTH_TOKEN = process.env.NEXT_TWILIO_AUTH_TOKEN;
export const NEXT_TWILIO_MESSAGE_SERVICE_SID = process.env.NEXT_TWILIO_MESSAGE_SERVICE_SID;
export const NEXT_QR_API_KEY = process.env.NEXT_QR_API_KEY;

import axios from 'axios';
export const sendVerificationCode = async (
    callback: (code: string) => void,
    username: string,
    type: string
) => {
    const code = Math.floor(Math.random() * 1000000);
    callback(code.toString());
    const verifyUsername = username;
    if (type === 'phone') {
        const content = {
            phone: verifyUsername,
            code: code.toString(),
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/phone`,
            content
        );
        return data;
    }
    else {
        const content = {
            email: verifyUsername,
            code: code.toString(),
        };
        const { data } = await axios.post(
            `${BASE_URL}/api/auth/verify/email`,
            content
        );
        return data;
    }
};