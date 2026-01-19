import {z} from "zod";

export const kycSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  }),
});

export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type KYCType = z.infer<typeof kycSchema>;
export type EmailType = z.infer<typeof emailSchema>;