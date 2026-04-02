import mongoose, { Schema } from 'mongoose';
import {z} from 'zod';
import { objectIdSchema } from '../utils/zod.utils';

export const ItemSchema = z.object({
    categoryId: objectIdSchema,
    restaurantId: objectIdSchema,
    name: z.string().min(1).max(255),
    ingredients: z.array(z.string()).optional().default([]),
    price : z.number().positive().multipleOf(0.01),
    imageUrl: z.string().min(1),
    isAvailable: z.boolean().optional().default(true),
    isPopular: z.boolean().optional().default(false)
})

export type IItem = z.infer<typeof ItemSchema>;



const ItemMongooseSchema = new Schema({
    categoryId: {type: Schema.Types.ObjectId,  required: true, ref:'Category'},
    restaurantId: {type: Schema.Types.ObjectId,required: true, ref:'Restaurant'},
    name: {type: String, required: true},
    ingredients: {type: [String]},
    price: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    isAvailable: {type: Boolean},
    isPopular : {type: Boolean}
}, {timestamps: true})


const Item = mongoose.model('Item', ItemMongooseSchema);
export default Item;
