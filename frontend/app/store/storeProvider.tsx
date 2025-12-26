'use client'
import { Provider } from "react-redux"
import store from "./store"
import AuthInit from "../components/AuthInit"

export const StoreProvider= ({children}) => {
   return(<Provider store={store}>
         <AuthInit>
            {children}
         </AuthInit>
      </Provider>
    )
}
