import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const authSchema = z.object({
    id: z
        .string()
        .uuid()
        .openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    firstName: z.string().min(3).max(30).optional().openapi({ example: 'John Doe' }),
    lastName: z.string().min(3).max(30).optional().openapi({ example: 'John Doe' }),
    email: z.string().email().openapi({ example: 'user1@mail.com' }),
    password: z.string().min(8).openapi({ example: '123456' }),
    createdAt: z.string().openapi({ example: '2023-01-01T00:00:00Z' }),
    updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00Z' }),
});
