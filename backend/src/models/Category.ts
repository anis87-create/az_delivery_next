import mongoose, { Model, Schema, Types } from 'mongoose';
interface ICategory {
    name: string,
    restaurantId: Types.ObjectId
}

interface ICategoryDocument  extends ICategory, Document {
    createdAt: Date,
    updatedAt: Date
}


const categorySchema = new Schema<ICategoryDocument>({
   name: {type: String, required: true},
   restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, {
    timestamps: true
});

const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>('category', categorySchema);
export default Category;