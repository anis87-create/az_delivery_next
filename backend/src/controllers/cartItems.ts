import { isGeneratorFunction } from 'util/types';
import CartItem from '../models/CartItem';
import Item from '../models/Items';
import Restaurant from '../models/Restaurant';
import type { Request, Response } from 'express';

export const getAllCartItems = async (req: Request, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(500).json({ msg: 'the id is undefined' });
        }
        const cartItem = await CartItem.findOne({ userId: req.user._id });
        res.status(200).json(cartItem);
    } catch (error) {
        console.log(error);
    }
}

export const incrementCartItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: 'id undefined' });
        }
        if (!req.user?._id) {
            return res.status(401).json({ msg: 'the user is undefined' });
        }

        // Récupérer l'item depuis la DB
        const itemDoc = await Item.findById(id);
        if (!itemDoc) {
            return res.status(404).json({ msg: 'item not found' });
        }

        let cartItem = await CartItem.findOne({ userId: req.user._id });
        if (!cartItem) {
            cartItem = new CartItem({ userId: req.user._id });
            await cartItem.save();
        }

        // Si l'item existe déjà dans le panier, incrémenter la quantité
        const updated = await CartItem.findOneAndUpdate(
            { userId: req.user._id, "items._id": id },
            { $inc: { "items.$.quantity": 1 } },
            { new: true }
        );

        // Sinon, spread les champs de l'item + quantity dans le tableau
        if (!updated) {
            const { _id, categoryId, restaurantId, ...itemFields } = itemDoc.toObject();
            const restaurant = itemDoc.restaurantId
                ? await Restaurant.findById(itemDoc.restaurantId).select('name baseFee')
                : null;
            const cart = await CartItem.findOneAndUpdate(
                { userId: req.user._id },
                { $push: { items: { _id, ...itemFields, restaurantName: restaurant?.name ?? '', restaurantId: itemDoc.restaurantId, baseFee: restaurant?.baseFee ?? 0, quantity: 1 } } },
                { new: true }
            );

            if (!cart) {
                return res.status(404).json({ msg: 'cart not found' });
            }
            return res.status(201).json(cart);
        }

        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'server error' });
    }
}

export const decrementCartItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: 'the item id is not found' });
        }
        if (!req.user?._id) {
            return res.status(401).json({ msg: 'the user is undefined' });
        }

        const cart = await CartItem.findOne({ userId: req.user._id });
        const targetItem = cart?.items.find(i => i._id.toString() === id);

        if (!cart || !targetItem) {
            return res.status(404).json({ msg: 'item not found' });
        }

        if (targetItem.quantity === 1) {
            const updated = await CartItem.findOneAndUpdate(
                { userId: req.user._id },
                { $pull: { items: { _id: id } } },
                { new: true }
            );
            return res.status(200).json(updated);
        }

        const updated = await CartItem.findOneAndUpdate(
            { userId: req.user._id, "items._id": id },
            { $inc: { "items.$.quantity": -1 } },
            { new: true }
        );
        return res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'server error' });
    }
}

export const removeCartItem = async (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: 'the item id is not found' });
        }
        if (!req.user?._id) {
            return res.status(401).json({ msg: 'the user is undefined' });
        }
       const cartItem =  await CartItem.findOneAndUpdate(
                { userId: req.user._id },
                { $set: { "items": [] } },
                { new: true }
        );
        return res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ msg: 'server error' });
    }
}