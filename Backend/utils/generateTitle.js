import GetSmartAiResponse from "./smartai.js";

const GenerateTitle = async (message) => {
    const title = await GetSmartAiResponse(`You are a chat title generator.
            Rules:
            - Look ONLY at the first user message
            - Generate a short, clear chat title
            - Title must be 2–5 words maximum
            - Do NOT add quotes
            - Do NOT add emojis
            - Do NOT explain anything
            - Output ONLY the title, nothing else

            User message:
            ${message}`);

    return title;
};

export default GenerateTitle;
