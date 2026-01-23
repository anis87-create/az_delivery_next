import * as mongoose from 'mongoose';
import {Types, Schema, model} from 'mongoose';
interface IItem {
    categoryId: Types.ObjectId,
    restaurantId: Types.ObjectId,
    name: string,
    ingredients: String [],
    price: number,
    imageUrl: string,
    isAvailable: boolean,
    isPopular: boolean
}

interface ItemDocument extends IItem , Document{
  createdAt: Date,
  updatedAt: Date
}

const ItemSchema = new Schema<ItemDocument>({
    categoryId: {type: Schema.Types.ObjectId, ref:'Category'},
    restaurantId: {type: Schema.Types.ObjectId, ref:'Restaurant'},
    name: {type: String, required: true},
    ingredients: {type: [String]},
    price: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    isAvailable: {type: Boolean},
    isPopular : {type: Boolean}
})


export default model<ItemDocument>('item', ItemSchema);
export { ItemDocument, IItem };
