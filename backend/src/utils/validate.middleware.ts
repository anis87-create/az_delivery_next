import { NextFunction, Request, Response } from "express";
import {  ZodType } from "zod";

export const validate = (schema: ZodType) => {
    return (req:Request, res: Response, next:NextFunction) => {
        const result = schema.safeParse(req.body);
        if(!result.success){
            const errors = result.error.issues.map((e) =>({
                field: e.path.join('.'),
                message: e.message
            }));
            return res.status(400).json({ success: false, msg: errors[0]?.message, errors })
        }
        req.body = result.data;
        next();
    }
} 

export const validateStatus = (schema: ZodType) => {
   return (req:Request, res: Response, next:NextFunction) => {
    // const updateStatusSchema = schema.ob
     const result = schema.safeParse(req.body);
     if(!result.success){
        const errors = result.error.issues.map((e) =>({
                field: e.path.join('.'),
                message: e.message
            }));
            console.log(errors);
            
          return res.status(400).json({ success: false, msg: errors[0]?.message, errors })
     }
     req.body = result.data;
     next();
   } 
}