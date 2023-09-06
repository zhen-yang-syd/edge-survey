export interface Survey {
    _id: string;
    title: string;
    target: {
        name: string;
    },
    createdAt: string;
    image: {
        asset: {
            url: string;
        }
    },
    qrCode? : {
        asset: {
            url: string;
        }
    },
    logo: {
        asset: {
            url: string;
        }
    },
    questions: Question[];
}
export interface Question {
    title: string;
    required: boolean;
    type: string;
    options: string[];
}