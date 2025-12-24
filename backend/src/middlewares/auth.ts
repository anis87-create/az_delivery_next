import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: string;
        // ajoutez d'autres propriétés si nécessaire
      };
    }
  }
}
const protect =  async (req: Request, res: Response, next: NextFunction) => {    
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret
      // 'jwt.verify' might return a specific type, so adjust as needed
      const decoded: any = jwt.verify(token as string, process.env.SECRET_TOKEN as string); 
      
      // Fetch the user and assign it to the extended request object
      // 'User.findById' should be awaitable
      const user = await User.findById(decoded.id).select('-password'); 
      if(!user){
        return res.status(401).json({ msg: 'User not found' });
      }
      req.user = user as any;
      
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ msg: 'Not authorized, token failed' }); // Added "token failed" for clarity
    }
  }

  // Moved the token check outside the if block
  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
}

export default protect;