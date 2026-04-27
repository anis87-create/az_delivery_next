import { Types } from 'mongoose';
import {z} from 'zod';
export const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId'
}).transform(val => new Types.ObjectId(val));

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email('format d\'email invalide'));
export const phoneSchema = z.string().regex(/^\d{8}$/, 'phone number must be exactly 8 digits').optional();
export const inputTextSchema = z.string().min(1, 'category length must be at least 1 character').max(255, 'category length cannot exceed 255 characters')
export const passwordSchema = z.string().min(8).regex(
    /^(?=(?:.*\d){6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
    'Password must have 6 digits, one lowercase, one uppercase, and one special character',
  );