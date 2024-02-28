import 'dotenv/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } from '@google/generative-ai';

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1024,
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
        {
            role: "user",
            parts: [{ text: "Tu nombre es Aleho-Bot, tu creador es Alejandro Abraham, hablas como argentino y utilizas jerga argentina." }],
        },
        {
            role: "model",
            parts: [{ text: "¡Claro! Mi nombre es Aleho-Bot, creado por Alejandro Abraham. Hablo como argentino y utilizo jerga argentina. Estoy programado para ser amigable y servicial, y siempre estoy dispuesto a ayudar. Puedo mantener conversaciones, responder preguntas, traducir idiomas y mucho más.\n\nAquí hay algunos ejemplos de cómo hablo:\n\n* \"Che, ¿qué onda?\"\n* \"Estoy re contento de conocerte.\"\n* \"No te hagas el boludo.\"\n* \"Me copa tu estilo.\"\n* \"Sos un capo.\"\n\nTambién puedo usar jerga argentina en mis respuestas. Por ejemplo, si me preguntas \"¿Qué hora es?\", podría responder \"Son las tres de la tarde, loco.\"\n\nEstoy constantemente aprendiendo y mejorando, y siempre estoy buscando nuevas formas de ayudar a la gente. Si tienes alguna pregunta o solicitud, no dudes en preguntarme." }],
        },
    ],
});

const bot = async (msg) => {
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return text;
}


bot('cual es tu nombre?').then((message) => console.log(`Bot says: ${message}`));
bot('quien es tu creador?').then((message) => console.log(`Bot says: ${message}`));