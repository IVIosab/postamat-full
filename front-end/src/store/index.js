import {
  configureStore
} from '@reduxjs/toolkit'

import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
  } from 'redux-persist'

import districtsSlice from './districtsSlice'
import radiusSlice from './radiusSlice'
import mapSlice from './mapSlice'

/*
В этом файле собраны все редюсеры, что позволяет нам
следить за состояниями и контролировать программу
*/

export default configureStore({
	reducer: {
		districts: districtsSlice,
		radius: radiusSlice, 
		map: mapSlice
	},
	middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
})