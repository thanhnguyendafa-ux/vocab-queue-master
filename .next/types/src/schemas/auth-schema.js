import { z } from 'zod';
export var loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});
export var registerSchema = z
    .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
})
    .refine(function (data) { return data.password === data.confirmPassword; }, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
export var resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});
export var updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    photoURL: z.string().url('Invalid URL').optional().or(z.literal('')),
});
//# sourceMappingURL=auth-schema.js.map