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
  city: inputTextSchema.optional(),
  zipCode: inputTextSchema.optional(),
  role: z.enum(USER_ROLE_ENUM),
  birthDate : z.string().optional(),
  avatar: z.string().optional(),
  googleId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type IUser = z.infer<typeof UserSchema>;
export const UserProfileSchema = UserSchema.omit({
  password: true,
  city: true,
  address: true,
  zipCode: true,
  role: true,
  createdAt: true,
  updatedAt: true
});
export type IUserProfile = z.infer<typeof UserProfileSchema>;

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export type ILogin = z.infer<typeof LoginSchema>;

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  updatePassword(password: string): Promise<boolean>;
}

const userMongooseSchema = new Schema<IUserDocument>({
    fullName: {type: String, required: true},
    email: {type: String, unique:true, required: true,lowercase: true,trim: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address:{type: String},
    city: {type: String},
    zipCode: {type: String},
    role: {
        type: String,
        enum: Object.values(USER_ROLE_ENUM),
        default: USER_ROLE_ENUM.Customer,
    },
    birthDate: {
      type: String 
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
      required: false
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
userMongooseSchema.methods.updatePassword = async function(newPassword: string): Promise<void> {
  comparePasswordSchema.parse(newPassword); 
  const saltRound = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, saltRound);
  this.password = hashedPassword; 
  await this.save();
};

const User = mongoose.model<IUserDocument>('User', userMongooseSchema);

export default User;

