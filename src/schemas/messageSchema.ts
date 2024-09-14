import {z} from 'zod'

export const MessageSchema = z.object({
    content: z
    .string()
    .min(5, {message : "Contant must be at least 10 characters"})
    .max(300, {message : "Contant must be no more longer than 300 characters"})
})