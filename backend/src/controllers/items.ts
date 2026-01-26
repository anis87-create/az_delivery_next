import { Request, Response } from 'express';
import Item from '../models/Items';
import Restaurant from '../models/Restaurant';



export const getAllItems = async (req: Request, res:Response) => {
    try {
        if(!req.user?._id){
            return res.status(500).json({msg:'the id is undefined'});
        }

        if(!req.user.restaurant?._id){
           return res.status(500).json({msg:'the id of restaurant is undefined'});
        }
        const items = await Item.find({restaurantId: req.user.restaurant?._id});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({error});
    }
}

export const createItem = async (req: Request, res:Response) => {
    try {
       const item = new Item({
        restaurantId: req.user?.restaurant?._id,
          ...req.body});
       const existedItem = await Item.findOne({name: req.body.name});
       if(existedItem){
         return res.status(409).json({msg:'the item already exist!'});
       }
       if(!req.body.name){
         return res.status(400).json({msg:'the name is required'});
       }
       if(!req.body.price){
         return res.status(400).json({msg:'the price is required'});
       }
       if(!req.body.imageUrl){
         return res.status(400).json({msg:'the imageUrl is required'});
       }
       await item.save();
       res.status(200).json(item);
    } catch (error) {
        res.status(500).json({error});
    }
}

export const updateItem = async (req: Request, res:Response) => {
    try {
       if(!req.params.id){
         return res.status(500).json({msg:'the id is undefined'});
    }
     const item = await Item.updateOne({_id: req.params.id}, {
        _id: req.params.id,
        ...req.body
    });
    res.status(200).json(item);
    } catch (error) {
        res.status(500).json({error});
    }
   
    
}

export const removeItem = async (req: Request, res:Response) => {
    try {
         if(!req.params.id){
           return res.status(400).json({msg:'the id is undefined'});
         }
         await Item.deleteOne({_id: req.params.id});
    } catch (error) {
        res.status(500).json({error});
    }
   
}


