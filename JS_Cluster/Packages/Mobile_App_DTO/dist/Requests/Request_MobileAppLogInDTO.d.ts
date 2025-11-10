import * as z from 'zod';
export declare const LogInRequestDTOSchema: z.ZodObject<{
    phone_number: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type Request_MobileAppLogInDTO = z.infer<typeof LogInRequestDTOSchema>;
