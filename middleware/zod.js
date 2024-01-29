const { z } = require('zod');

const chatSchema = z.object({
    sender: z.string(),
    receiver: z.string(),
    message: z.string().nonempty({ message: 'Message is required' }),
    time: z.date().default(() => new Date()),
});


const userSchema = z.object({
    username: z.string().nonempty({ message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().nonempty({ message: 'Password is required' }),
    status: z.enum(['online', 'offline']).default('offline'),
    chats: z.array(z.string()),
});

module.exports = { chatSchema, userSchema };