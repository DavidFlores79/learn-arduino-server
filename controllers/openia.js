const { response } = require("express");
const userModel = require("../models/user");
const ChatMessage = require("../models/chatMessages");
const { OpenAI } = require('openai');
const CurrencyConverter = require('currency-converter-lt');
const { getCurrentDateTime } = require("../helpers/functions");
const axios = require('axios');

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

const openAIFunctionCall = async (req, res = response) => {

    const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    });

    try {

        const { uid } = req;
        const { message, supplier } = req.body;
        const currentDateTime = getCurrentDateTime();
        console.log({ supplier });

        let chatMessages = await getChatMessages(uid);

        if (chatMessages.length === 0) {
            await addChatMessage({
                chatId: 'XXX',
                userId: uid,
                role: 'system',
                content: `The current date and time is ${currentDateTime}. The first day of the week is Monday. A complete week is from Monday to Friday. Purchase Order Request Appointment must always ask for a Date and Time to deliver`,
                model: 'XXX',

            });

        }

        await addChatMessage({
            chatId: 'XXX',
            userId: uid,
            role: 'user',
            content: message,
            model: 'XXX',

        });

        let response;
        while (true) {
            response = await fetchCompletion(openai, uid);

            if (response.choices[0].finish_reason === 'stop') {
                // console.log(response.choices[0].message);
                if (response.choices[0].message.role === 'assistant' && response.choices[0].message.content != '') {
                    await addChatMessage({
                        chatId: response.id,
                        userId: uid,
                        role: response.choices[0].message.role,
                        content: response.choices[0].message.content,
                        model: response.model,
                    });
                }
                break;
            }

            if (response.choices[0].finish_reason === 'function_call') {
                console.log('function_call', response.choices[0].message.function_call);
                const { name: functionName, arguments: functionArguments } = response.choices[0].message.function_call;

                let functionToInvoke = () => { };
                switch (functionName) {
                    case 'search_purchase_orders_by_date':
                        console.log('buscar fechas');
                        functionToInvoke = searchPurchaseOrderFunction;
                        break;
                        case 'appointment_request_for_purchase_order':
                        console.log('pedir cita');
                        functionToInvoke = purchaseOrderAppointmentRequest;
                        console.log({ functionName });
                        break;
                    default:
                        // throw new Error('No se puede ejecutar ninguna funcion');
                        console.log('No se puede ejecutar ninguna funcion');
                        break;
                }

                console.log({ functionArguments });
                const parameters = JSON.parse(functionArguments);
                parameters.supplier = supplier;
                console.log({ parameters });
                const result = await functionToInvoke(parameters);
                // console.log(result);

                await addChatMessage({
                    chatId: 'XXX',
                    userId: uid,
                    role: 'assistant',
                    model: 'XXX',
                    function_call: {
                        name: functionName,
                        arguments: functionArguments,
                    }
                });
                await addChatMessage({
                    chatId: 'XXX',
                    userId: uid,
                    role: 'function',
                    name: functionName,
                    model: 'XXX',
                    content: JSON.stringify({ result }),
                });
            }
        }

        chatMessages = await getChatMessages(uid);

        res.json({
            ok: true,
            msg: response.choices[0].message.content ?? '',
            uid: uid,
            response,
            chatMessages,
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        })
    }
}

const searchPurchaseOrderFunction = async (data) => {
    console.log({ data });

    try {
        let result;

        ordersInfo = await searchOrders(data);
        result = ordersInfo;
        console.log(ordersInfo);
        return result;

    } catch (error) {
        return 'Error: Could not perform this method.'
    }
}

const purchaseOrderAppointmentRequest = async (data) => {
    console.log('**************** purchaseOrderAppointmentRequest ****************');
    console.log({ data });

    try {
        let result;

        const response = await requestAppointment(data);
        console.log(response);
        result = response;
        return result;

    } catch (error) {
        console.log(error);
        return 'Error: Could not perform this method.'
    }
}

const currencyConversionFunction = async ({ data }) => {
    console.log({ data });
    const matches = data.match(/(\d+)\s+(\w+)\s+to\s(\w+)/i);
    console.log({ matches });

    if (!matches) {
        return 'Error: Invalid format. Please use format \'convert 100 "USD to "EUR"\'.';
    }

    const [, amount, sourceCurrency, targetCurrency] = matches;
    console.log({ amount });
    const currencyConverter = new CurrencyConverter({
        from: sourceCurrency,
        to: targetCurrency,
        amount: Number(amount)
    });

    try {
        const conversionResult = await currencyConverter.convert();
        console.log(`conversionResult ${conversionResult}`);
        return conversionResult;
    } catch (error) {
        return 'Error: Could not perform currency conversion.'
    }
}

const fetchCompletion = async (openai, uid) => {

    let chatMessages = await getChatMessages(uid);
    // console.log(chatMessages);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        functions: [
            {
                name: 'convert',
                description: 'Convert currencies',
                parameters: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'string',
                            description: 'Convert from one currency to another (i.e. 100 USD to SGD)',
                        }
                    },
                    required: ['data'],
                }
            },
            {
                name: "search_purchase_orders_by_date",
                description: "Obtain how many Purchase Orders exist between two dates.",
                parameters: {
                    type: "object",
                    properties: {
                        start_date: {
                            "type": "string",
                            "description": "the initial date for search."
                        },
                        end_date: {
                            "type": "string",
                            "description": "the final date for search."
                        },
                    },
                    required: [
                        "start_date",
                        "end_date"
                    ]
                }
            },
            {
                name: "appointment_request_for_purchase_order",
                description: "Only to Request an appointment to deliver a Purchase Order", //. Must have Confirmed status
                parameters: {
                    type: "object",
                    properties: {
                        doc_num: {
                            "type": "string",
                            "description": "document number of the Purchase Order."
                        },
                        appointment_request_date: {
                            "type": "string",
                            "description": "date and time to deliver that Purchase Order."
                        },
                    },
                    required: [
                        "doc_num",
                        "appointment_request_date"
                    ]
                }
            }
        ],
        temperature: 0,
    });

    return response;
}

const getChatMessages = async (uid) => {
    try {
        const systemMessage = await ChatMessage.findOne({ role: 'system' }, 'role content');

        const userAndAssistantMessages = await ChatMessage.find({
            role: { $in: ['user', 'assistant', 'function'] },
            userId: uid
        })
            .sort({ createdAt: -1 })
            .limit(6)
            .select('role content name function_call');


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
        // console.log('Message added successfully');

        return chatMessage;

    } catch (error) {
        console.error('Error adding chat message:', error);
    }
}

const requestAppointment = async ({ doc_num, appointment_request_date, supplier }) => {
    const endpoint = '/api/v1/purchase-orders/appointment-request';

    let data = JSON.stringify({
        "doc_num": doc_num,
        "appointment_request_date": appointment_request_date,
        "supplier": supplier
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://proveedoressbo.test.com${endpoint}`,
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjMsImlzcyI6IkRFViBQcm92ZWVkb3JlcyBTQk8iLCJhdWQiOiIiLCJleHAiOjE3MTY2ODY1ODQsImlhdCI6MTcxNjY3OTM4NCwibmJmIjoxNzE2Njc5Mzg0LCJqdGkiOiI2NjUyNzJkOGE0MGVhIn0.e60m0Sdch98k7ajKIb0kJg74jNFzYFH6oG67cclsrHKgdp6xR5y0YBKSf6XJLhF0vjIaeVfOb1jNGIOxE9mt0g',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('No fue posible encontrar el proveedor');
    }
}

const searchOrders = async ({ start_date, end_date, supplier }) => {
    const endpoint = '/api/v1/purchase-orders';

    let data = JSON.stringify({
        "start_date": start_date,
        "end_date": end_date,
        "supplier": supplier
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://proveedoressbo.test.com${endpoint}`,
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjMsImlzcyI6IkRFViBQcm92ZWVkb3JlcyBTQk8iLCJhdWQiOiIiLCJleHAiOjE3MTY2ODY1ODQsImlhdCI6MTcxNjY3OTM4NCwibmJmIjoxNzE2Njc5Mzg0LCJqdGkiOiI2NjUyNzJkOGE0MGVhIn0.e60m0Sdch98k7ajKIb0kJg74jNFzYFH6oG67cclsrHKgdp6xR5y0YBKSf6XJLhF0vjIaeVfOb1jNGIOxE9mt0g',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('No fue posible encontrar el proveedor');
    }
}


module.exports = {
    chatWithOpenAI,
    openAIFunctionCall,
}