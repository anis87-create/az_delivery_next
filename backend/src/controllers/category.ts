import { Request, Response } from 'express';
import Category from '../models/Category';
import Restaurant from '../models/Restaurant';

export const getAllCategories =  async (req: Request, res:Response) => {
   try {
     const categories = await Category.find();
     res.status(200).send(categories);
   } catch (error) {
     console.log({error})
   }
}

export const createCategory =  async (req: Request, res:Response) => {
     if(!req.user?._id){
        return res.status(500).json({msg:'id is undefined'})
    }
   const restaurant= await Restaurant.findOne({owner: req.user._id});
   if(!restaurant){
      return res.status(404).json({msg:'restaurant is not found'})
   }
    
    try {
        const category = new Category({
            ...req.body,
            restaurantId: restaurant._id
        });
        if(!req.body.name){
            return res.status(400).json({msg:'the name of category is required'});
        }
        await category.save();
        res.status(201).json(category)
        
    } catch (error) {
         console.log({error})
    }
}

export const updateCategory = async (req: Request, res:Response) => {    
    try {
        if(!req.params?.id) {
          return res.status(500).json({msg:'the id of category is undefined!'})
        }

        if(!req.body.name){
            return res.status(400).json({msg:'the name of category is required!'})
        }
        
        await Category.updateOne({_id: req.params.id}, {
            name: req.body.name,
            _id: req.params.id
        });
        res.status(200).json({
            _id: req.params.id,
            name: req.body.name
        });
    } catch (error) {
        console.log(error);
    }
}

export const removeCategory= async (req: Request, res:Response) => {
  try {
    if(!req.params?.id) {
          return res.status(500).json({msg:'the id of category is undefined!'})
    }
    await Category.deleteOne({_id: req.params.id});
    res.status(200).json({msg:'Category deleted succesfuly'});
  } catch (error) {
    
  }

}
