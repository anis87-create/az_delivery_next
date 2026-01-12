import { Request, Response } from 'express';
import Category from '../models/Category';

export const getAllCategories =  async (req: Request, res:Response) => {
   try {
     const categories = await Category.find();
     res.status(200).send(categories);
   } catch (error) {
     console.log({error})
   }
}

export const createCategory =  async (req: Request, res:Response) => {
    try {
        const category = new Category({
            ...req.body
        });
        if(!req.body.name){
            return res.status(400).json({msg:'the name of category is required'});
        }
        await category.save();
    } catch (error) {
         console.log({error})
    }
}

export const updateCategory = (req: Request, res:Response) => {}

export const removeCategory= (req: Request, res:Response) => {}
