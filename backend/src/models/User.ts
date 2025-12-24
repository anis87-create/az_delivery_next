import mongoose, { Schema, Document, Model } from 'mongoose';
enum UserRole {
  Customer = 'customer',
  RestaurantOwner= 'restaurant_owner'
}

interface IUser {
   fullName: string,
   email: string,
   password: string,
   phone?: string,
   address?: string,
   role: UserRole
};
interface IUserDocument extends IUser, Document {
  createdAt: Date,
  updatedAt: Date,
  comparePassword(candidatePassword: string): Promise<boolean>; 
}

interface ValidatorProps {
  value: string
}
const userSchema = new Schema<IUserDocument>({
    fullName: {type: String, required: true},
    email: {type: String, unique:true, required: true,lowercase: true,trim: true, 
    validate: {
      validator: function(v: string) {
         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props: ValidatorProps) => `${props.value} is not a valid email address!`
    }
    },
    password: {type: String, required: true},
    phone: {type: String},
    address:{type: String},
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.Customer,
    }
}, {
    timestamps: true
});
userSchema.methods.comparePassword = async function(
      candidatePassword: string
  ): Promise<boolean> {
      const bcrypt = require('bcrypt');
      return bcrypt.compare(candidatePassword, this.password);
  };

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

export default User;
export { IUser, IUserDocument, UserRole };
