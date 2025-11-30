'use client'
import { Provider } from "react-redux"
import store from "./store.jsx"

export const StoreProvider= ({children}) => {
   return <Provider store={store}>{children}</Provider>
}
