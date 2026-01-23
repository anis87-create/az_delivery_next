/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import Restaurant from '../models/Restaurant';

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token as string, process.env.SECRET_TOKEN as string);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ msg: 'User not found' });
      }
      req.user = {
        _id: user._id.toString(),
        role: user.role
      }
      if(user.role === 'restaurant_owner'){
        const restaurant = await Restaurant.findOne({ owner: user._id });                                       
        if (restaurant) {                                                                                       
          req.user.restaurant = { _id: restaurant._id.toString() };                                             
        }   
      }

      return next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

export default protect;