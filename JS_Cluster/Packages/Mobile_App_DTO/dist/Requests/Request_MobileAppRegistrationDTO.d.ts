import * as z from 'zod';
export declare const RegistrationRequestDTOSchema: z.ZodObject<{
    full_name: z.ZodString;
    phone_number: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type Request_MobileAppRegistrationDTO = z.infer<typeof RegistrationRequestDTOSchema>;
