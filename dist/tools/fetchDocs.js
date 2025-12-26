import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const getDocUrlInput = {
    packageNames: z
        .array(z.string())
        .describe("List of package names to find documentation for."),
};
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
export const getDocUrlHandler = async (args) => {
    if (!process.env.GEMINI_API_KEY) {
        return {
            content: [
                {
                    type: "text",
                    text: "Error: GEMINI_API_KEY is not set in environment variables.",
                },
            ],
            isError: true,
        };
    }
    const resultData = {};
    for (const packageName of args.packageNames) {
        try {
            const prompt = `What is the official documentation URL for the package '${packageName}'? Return ONLY the URL, nothing else. If you don't know, return 'Not found'.`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let url = response.text().trim();
            // Basic cleanup in case Gemini adds markdown or extra info
            if (url.includes("\n"))
                url = url.split("\n")[0];
            url = url.replace(/`/g, "");
            resultData[packageName] = url;
        }
        catch (error) {
            resultData[packageName] = `Error fetching docs: ${error.message}`;
        }
    }
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(resultData, null, 2),
            },
        ],
    };
};
