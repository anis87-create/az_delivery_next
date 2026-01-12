import mongoose, { Model, Schema } from 'mongoose';
interface ICategory {
    name: string
}

interface ICategoryDocument  extends ICategory, Document {
    createdAt: Date,
    updatedAt: Date
}


const categorySchema = new Schema<ICategoryDocument>({
   name: {type: String, required: true}
}, {
    timestamps: true
});

const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>('category', categorySchema);
export default Category;