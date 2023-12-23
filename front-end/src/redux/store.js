import { configureStore } from '@reduxjs/toolkit'
import userReducer from './loginSlice'

export default configureStore({
    reducer:{
        user: userReducer,
    }
})