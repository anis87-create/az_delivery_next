import mongoose, { Schema } from 'mongoose';
import {z} from 'zod';
import { inputTextSchema, objectIdSchema } from '../utils/zod.utils';



export const categorySchema = z.object({
    name: inputTextSchema,
    restaurantId: objectIdSchema,
})

export type ICategory = z.infer<typeof categorySchema>;

const categoryMongooseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref:'Restaurant', required: true }
}, {
    timestamps: true
})



const Category = mongoose.model('Category', categoryMongooseSchema);
export default Category;