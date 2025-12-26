import { Request, Response } from "express";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import Restaurant from "../models/Restaurant";

export const generateToken = (id: string) => {
  const secret = process.env.SECRET_TOKEN;
  if (!secret) {
    throw new Error("SECRET_TOKEN is not defined in environment");
  }

  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ msg: 'Password is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);

    if (match) {
      const userWithoutPassword = await User.findOne({ email }).select('-password');
      return res.status(200).json({
        msg: 'User authenticated',
        user: userWithoutPassword,
        token: generateToken(user._id!)
      });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ msg: 'Server error', error });
  }
};

export const register = async (req:Request, res:Response) => {
    try {
      const { fullName, email, password, name, category, type, street,city, zipCode, phone,deliveryZone } = req.body;
      let emailFound = await User.findOne({email});
      if(emailFound){
        return res.status(409).json({msg:'the user already exist!'})
      }else {
        if(!password){
            return res.status(400).json({msg:'password not found!'})
        }
        const saltRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);

        if(!email){
          return res.status(400).json({msg:'email is required'})
        }

        if(!fullName){
          return res.status(400).json({msg:'fullName is required'}) 
        }

        let user = new User({
          ...req.body,
          password: hashedPassword
        });
          
        
        if(req.body.role === 'customer'){
          await user.save();
          res.status(201).json({msg:'customer saved!',user})
        }else if(req.body.role === 'restaurant_owner') {
          await user.save();
          if(!name){
            return res.status(400).json({msg:'restaurant name is required'})
          }
          if(!category){
            return res.status(400).json({msg:'category of restaurant  is required'})
          }
          if(!type){
            return res.status(400).json({msg:'type of restaurant  is required'})
          }
          if(!street){
            return res.status(400).json({msg:'street of restaurant  is required'})
          }
          if(!city){
            return res.status(400).json({msg:'city  is required'})
          }
          if(!zipCode){
            return res.status(400).json({msg:'zipCode  is required'})
          }
          if(!phone){
            return res.status(400).json({msg:'phone  is required'})
          }
          if(!deliveryZone){
            return res.status(400).json({msg:'deliveryZone  is required'})
          }   
          const restaurant = new Restaurant({
            ...req.body,
            owner: user._id
          });
          await restaurant.save();
          res.status(201).json({msg:'restaurant saved!', restaurant})
          } 
        }
    } catch (error) {
      res.status(500).json({error});
    }
  
}

export const authMe = async (req:Request, res:Response) => {


 try {
    if (!req.user?._id) {
      return res.status(401).json({msg: 'User not authorized'});
    }
    const user = await User.findById(req.user._id);
    if(!user){
       return res.status(404).json({ msg: "User not found" });
    }
    const { _id, fullName, email, role } = user;
    if(req.user.role === 'customer'){
      res.status(200).json({_id, fullName, email, role});
    }else {
      const restaurant = await Restaurant.findOne({owner: req.user._id});
      res.status(200).json({_id, fullName, email, role, restaurant});
    }


 } catch (error) {
    res.status(500).json({error})
 }
}
