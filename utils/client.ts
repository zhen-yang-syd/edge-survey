import sanityClient from "@sanity/client";
import { NEXT_PUBLIC_SANITY_TOKEN } from "@/utils";

export const client = sanityClient({
    projectId: "er52rfe6",
    dataset: "production",
    apiVersion: "2022-11-11",
    useCdn: true,
    token: NEXT_PUBLIC_SANITY_TOKEN,
    ignoreBrowserTokenWarning: true
});
