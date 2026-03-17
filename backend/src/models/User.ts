import mongoose, { Schema, Document } from 'mongoose';
import {z} from 'zod'; 
import * as bcrypt from 'bcrypt';
import { emailSchema, inputTextSchema, passwordSchema, phoneSchema } from '../utils/zod.utils';


export const USER_ROLE_ENUM = {
  Customer: 'customer',
  RestaurantOwner: 'restaurant_owner'
} as const;

export type UserRole = typeof USER_ROLE_ENUM[keyof typeof USER_ROLE_ENUM];

export const UserSchema = z.object({
  fullName: inputTextSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber:  phoneSchema,
  address: inputTextSchema.optional(),
  role: z.enum(USER_ROLE_ENUM),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type IUser = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export type ILogin = z.infer<typeof LoginSchema>;

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userMongooseSchema = new Schema<IUserDocument>({
    fullName: {type: String, required: true},
    email: {type: String, unique:true, required: true,lowercase: true,trim: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address:{type: String},
    role: {
        type: String,
        enum: Object.values(USER_ROLE_ENUM),
        default: USER_ROLE_ENUM.Customer,
    }
}, {
    timestamps: true
});
const comparePasswordSchema = z.string().min(1, 'Password is required');

userMongooseSchema.methods.comparePassword = async function(
      candidatePassword: string
  ): Promise<boolean> {
      comparePasswordSchema.parse(candidatePassword);
      return bcrypt.compare(candidatePassword, this.password);
  };

const User = mongoose.model<IUserDocument>('User', userMongooseSchema);

export default User;

