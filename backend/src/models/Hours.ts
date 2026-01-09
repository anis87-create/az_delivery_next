import * as mongoose from 'mongoose';
interface IHours {
    open: string,
    close: string,
    closed?: boolean
}
const HoursSchema = new mongoose.Schema<IHours>({
    open: {
        type: String,
        required: true
    },
    close : {
        type: String, 
        required: true
    },
    closed: {
        type: Boolean,
        default: false
    }
}, {
    _id: false
});
export {IHours}
export default HoursSchema;