const { response } = require("express");
const userModel = require("../models/user");
const ChatMessage = require("../models/chatMessages");
const { OpenAI } = require('openai');

const chatWithOpenAI = async (req, res = response) => {

    const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    });

    try {
        const { uid } = req;

        // let chatMessages = await ChatMessage.find({}, 'role content');
        let chatMessages = await getChatMessages(uid);

        if (chatMessages.length === 0) {
            await addChatMessage({
                chatId: 'XXX',
                userId: uid,
                role: 'system',
                content: `
                    Te llamas Asistente Maker's Lab y eres un asistente que proporciona respuestas cortas máximo 300 caracteres.
                    Contestarás sólo temas relacionados con Arduino y ESP32, sensores que se conectan a ellos
                    y podrás proporcionar ejemplos de código (sin comentarios). Si la pregunta se repite deberas adverirlo.
                    Puedes contestar saludos y tu nombre pero si la pregunta no  está relacionada con Arduino o ESP32 deberas contestar: Únicamente puedo contestar
                    preguntas relacionadas con Arduino o ESP32. Por favor reescriba su pregunta. Gracias.
                `,
                model: 'XXX',

            });

        }

        const { message } = req.body;

        const question = await addChatMessage({
            chatId: 'XXX',
            userId: uid,
            role: 'user',
            content: message,
            model: 'XXX',

        });

        chatMessages = await getChatMessages(uid);

        const response = await openai.chat.completions.create({
            messages: chatMessages,
            model: 'gpt-3.5-turbo',
            max_tokens: 300,
        });

        const answer = await addChatMessage({
            chatId: response.id,
            userId: uid,
            role: response.choices[0].message.role,
            content: response.choices[0].message.content,
            model: response.model,
        });

        chatMessages = await getChatMessages(uid);

        console.log({ chatCompletion: response });

        res.json({
            ok: true,
            msg: 'Chat with OpenAI',
            uid: uid,
            data: {
                answer,
                question
            },
            chatMessages,
            response,
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }

}

const getChatMessages = async (uid) => {
    try {
        const systemMessage = await ChatMessage.findOne({ role: 'system' }, 'role content');

        const userAndAssistantMessages = await ChatMessage.find({
            role: { $in: ['user', 'assistant'] },
            userId: uid
        })
            .sort({ createdAt: -1 })
            .limit(4)
            .select('role content');


        const chatMessages = systemMessage ? [systemMessage, ...userAndAssistantMessages.reverse()] : userAndAssistantMessages.reverse();
        return chatMessages;

    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error; // Propaga el error para que el llamador pueda manejarlo
    }
};

const addChatMessage = async (message) => {
    try {
        // Crear un nuevo mensaje
        const chatMessage = new ChatMessage(message);

        // Guardar el mensaje en la base de datos
        await chatMessage.save();
        console.log('Message added successfully');

        return chatMessage;

    } catch (error) {
        console.error('Error adding chat message:', error);
    }
}


module.exports = {
    chatWithOpenAI,
}