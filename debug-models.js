import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        // Read .env.local manually since we don't want to rely on dotenv package being present
        const envPath = path.resolve(process.cwd(), '.env.local');
        let apiKey = '';
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const match = content.match(/GEMINI_API_KEY=(.*)/);
            if (match) {
                apiKey = match[1].trim();
            }
        }

        if (!apiKey) {
            console.error("Could not find GEMINI_API_KEY in .env.local");
            return;
        }

        console.log("Using API Key ending in:", apiKey.slice(-4));

        const ai = new GoogleGenAI({ apiKey: apiKey });

        console.log("Fetching available models...");
        // The SDK might have a different way to list models, or we might need to use the REST API if the SDK doesn't expose it easily in this version.
        // But let's try the models.list() if it exists on the client or similar.
        // Checking the SDK docs (mental check): @google/genai is the new one.
        // It usually has `ai.models.list()`.

        const response = await ai.models.list();

        console.log("Available models:");
        for await (const model of response) {
            console.log(`- ${model.name} (Supported generation methods: ${model.supportedGenerationMethods})`);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

main();
