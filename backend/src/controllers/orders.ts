import { Request, Response } from "express";
import Order from "../models/Order";

const getAllOrders = async (req: Request,res: Response) => {
    try {
        if(!req.user) {
            return res.status(401).json({ msg:'the user is undefined' });
        }
        const orders = await Order.find({ userId: req.user._id });
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({error});
    }
}

const addOrder = async (req: Request, res: Response) => {
    try {
        if(!req.user) {
            return res.status(400).json({ msg:'the user is undefined' });
        }
        let order = await Order.findOne({  userId: req.user._id });
        if(!order){
            if(!req.body.deliveryAddress) {
                return res.status(400).json({ msg: 'deliveryAddress is required' });
           }
            if(!req.body.deliveryAddress.street){
                return res.status(400).json({msg:'the delivery Address is required'});
            }
            if(!req.body.deliveryAddress.city) {
                return res.status(400).json({msg:'the city is required'});
            }
            if(!req.body.deliveryAddress.zipCode) {
                return res.status(400).json({msg:'the zipCode is required'});
            }
            order = new Order({...req.body});
            await order.save();
            return res.status(201).json(order);
        }else {
            return res.status(409).json({msg:'the order already exists!'})
        }
        
    } catch (error) {
        res.status(500).json({error});
    }
} 

const removeOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({msg:'the id is undefined'});
        }
        if(!req.user){
            return res.status(400).json({msg:'the user is undefined'})
        }
        const result = await Order.deleteOne({ _id: id, userId: req.user._id });
        if(result.deletedCount === 0){
            return res.status(404).json({msg:'order not found'});
        }
        return res.status(200).json({msg:'order removed!'});
    } catch (error) {
        res.status(500).json({error});
    }
}

const getOneOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(400).json({msg:'the id is undefined'});
        }
        let order = await Order.findById(id);
        if(!order){
            return res.status(404).json({msg:'the order is not found'});
        }
        res.status(200).json(order); 
    } catch (error) {
        res.status(500).json({ error });
    }
}

const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(400).json({msg:'the id is undefined'});
        }
        let updatedOrder = await Order.findOneAndUpdate(
            { _id:id },
            { $set: { status: req.body.status } },
            { new: true }
        )
        if(!updatedOrder){
            return res.status(404).json({msg:'the order is not found!'})
        };
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export { getAllOrders, getOneOrder, addOrder, removeOrder, updateStatus}
