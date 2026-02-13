import CartItem from '../models/CartItem';
import type { Request, Response } from 'express';

export const getAllCartItems = async (req:Request, res: Response) => {
    console.log('gertAll');
    
   try {
     if(!req.user?._id){
            return res.status(500).json({msg:'the id is undefined'});
         }

     const cartItems = await CartItem.find({userId: req.user._id});
     res.status(200).json(cartItems);
   } catch (error) {
     console.log(error);
   }
}

export const addToCartItem = async (req: Request, res:Response) => {
    try {
       const {id} = req.params;
       if(!id){
        return res.status(400).json({msg:'id undefined'});
       }
       if(!req.user?._id){
        return res.status(401).json({msg:'the user is undefined'});
       }
       const cartItem = new CartItem({
         restaurantId : req.user.restaurant?._id ? req.user.restaurant?._id : req.body.restaurantId,
         userId: req.user?._id
       })

       cartItem.save();

       // 1 seule requête : si l'item existe déjà, on met à jour sa quantité
       const updated = await CartItem.findOneAndUpdate(
         { userId: req.user._id, "items.itemId": id },
         { $set: { "items.$.quantity": req.body.quantity } },
         { new: true }
       );

       // Si updated est null, l'item n'existe pas encore → on l'ajoute
       if(!updated){
         const cart = await CartItem.findOneAndUpdate(
           { userId: req.user._id },
           { $push: { items: { itemId: id, price: req.body.price, } } },
           { new: true }
         );

         
         if(!cart){
           return res.status(404).json({msg:'cart not found'});
         }
         return res.status(201).json(cart);
       }

       res.status(200).json(updated);
    } catch (error) {
      console.log(error);
      res.status(500).json({msg:'server error'});
    }
}

export const removeCartItem = async (req: Request, res:Response) => {
  try {
    await CartItem.deleteOne({_id: req.params.id});
    res.status(200).json({msg:'the cartItem is deleted succesfully'});
  } catch (error) {
     
  }
}