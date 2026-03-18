import mongoose, { Schema } from 'mongoose';
import { scheduleDefinition } from './Schedule';
import { z } from 'zod';
import { emailSchema, inputTextSchema, objectIdSchema, phoneSchema } from '../utils/zod.utils';

const hoursZodSchema = z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean().optional().default(false)
});

const scheduleZodSchema = z.object({
    monday: hoursZodSchema,
    tuesday: hoursZodSchema,
    wednesday: hoursZodSchema,
    thursday: hoursZodSchema,
    friday: hoursZodSchema,
    saturday: hoursZodSchema,
    sunday: hoursZodSchema
});

export const RestaurantSchema = z.object({
    owner: objectIdSchema,
    name: inputTextSchema,
    category: inputTextSchema,
    type: z.string().optional(),
    img: z.string().optional(),
    coverImg: z.string().optional(),
    street: inputTextSchema,
    city: inputTextSchema,
    zipCode: z.string().min(4).max(10),
    phone: phoneSchema,
    description: z.string().optional(),
    email: emailSchema,
    tags: z.array(z.string()).optional(),
    baseFee: z.number().positive(),
    openingHours: scheduleZodSchema.optional(),
    estimatedDeliveryTime: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type IRestaurant = z.infer<typeof RestaurantSchema>;

const restaurantMongooseSchema = new Schema<IRestaurant>({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String },
    img: { type: String },
    coverImg: { type: String },
    street :{ type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String },
    email: { type: String, required: true },
    tags: { type: [String] },
    baseFee: { type: Number, required: true },
    openingHours: scheduleDefinition,
    estimatedDeliveryTime: { type: String }
}, {
    timestamps: true
});
const Restaurant = mongoose.model<IRestaurant>('restaurant', restaurantMongooseSchema);
export default Restaurant;
