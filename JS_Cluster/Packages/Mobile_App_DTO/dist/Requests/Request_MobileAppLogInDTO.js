import * as z from 'zod';
export const LogInRequestDTOSchema = z.object({
    phone_number: z.string(),
    password: z.string()
});
