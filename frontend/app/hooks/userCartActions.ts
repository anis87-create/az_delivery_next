import { useDispatch } from "react-redux"
import { AppDispatch } from "./hooks";
import { addCartItem, removeFromCartItem } from "../store/slices/cartItemSlice";

export const useCartActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    const incrementCounter = (id:string) => {
        dispatch(addCartItem(id));
    }
    const decrementCounter = (id: string) => {
        dispatch(removeFromCartItem(id));
    }

    return [incrementCounter, decrementCounter];
}
