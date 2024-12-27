import z from 'zod';

export const loginSchema = z.object({
    email: z.string({ message: 'Email is required in the request body.' }).email({ message: 'Invalid email format' }),
    password: z.string({ message: 'Password is required in the request body.' }).min(6, { message: 'Password must be at least 6 characters long' })
});

export const signupSchema = z.object({
    username: z.string({ message: 'Username is required in the request body' }).min(3, { message: 'Username must be at least 6 Characters long' }),
    email: z.string({ message: 'Email is required in the request body.' }).email({ message: 'Invalid email format' }),
    password: z.string({ message: 'Password is required in the request body.' }).min(6, { message: 'Password must be at least 6 characters long' })
})
