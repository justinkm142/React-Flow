import {configureStore } from '@reduxjs/toolkit'

import flowReducer from './slices/flow.slices'


export const store = configureStore({
    reducer:{
        flow: flowReducer,
    }
})