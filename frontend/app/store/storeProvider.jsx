'use client'
import { Provider } from "react-redux"
import store from "./store.jsx"
import AuthInit from "../components/AuthInit.jsx"

export const StoreProvider= ({children}) => {
   return(<Provider store={store}>
         <AuthInit>
            {children}
         </AuthInit>
      </Provider>
    )
}
