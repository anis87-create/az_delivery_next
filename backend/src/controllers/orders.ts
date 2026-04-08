import { Request, Response } from "express";
import Order from "../models/Order";
import { IRestaurant } from "../models/Restaurant";
import { IUser, USER_ROLE_ENUM } from "../models/User";

const getAllOrders = async (req: Request,res: Response) => {
    try {
        if(!req.user) {
            return res.status(400).json({ msg:'the user is undefined' });
        }
        if(!req.user.restaurant){
            return res.status(400).json({ msg:'the restaurant is undefined' });
        }
        const orders = req.user.role === USER_ROLE_ENUM.Customer ? await Order.find({ userId: req.user._id }): await Order.find({restaurantId: req.user.restaurant?._id}).populate<{userId: IUser}>('userId');
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
        if(!req.body.firstName) {
            return res.status(400).json({ msg: 'firstName is required' });
        }
        if(!req.body.lastName) {
            return res.status(400).json({ msg: 'lastName is required' });
        }
        if(!req.body.email) {
            return res.status(400).json({ msg: 'email is required' });
        }
        if(!req.body.phoneNumber) {
            return res.status(400).json({ msg: 'phoneNumber is required' });
        }
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
        const order = new Order({
            userId: req.user._id,
            ...req.body
        });
        await order.save();
        return res.status(201).json(order);
        
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
        let order = await Order.findById(id).populate<{ restaurantId: IRestaurant }>('restaurantId');
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
        console.log(error);
        
        res.status(500).json({ error });
    }
}

export { getAllOrders, getOneOrder, addOrder, removeOrder, updateStatus}
