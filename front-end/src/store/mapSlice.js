import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
	name: 'map',
	initialState: {
		chosenObjects : [],
		chosenPoint : [],
		zoomParameter: 0
	},
	reducers: {
		chooseObjects(state, action) {
			state.chosenObjects = action.payload
		},
		chooseMap(state, action){
			state.mapReference = action.payload
		},
		choosePoint(state, action){
			state.chosenPoint = action.payload.coordinates
			state.zoomParameter = action.payload.zoom
		},
		resetMap(state, action){
			state.chosenObjects = []
			state.chosenPoint = []
			state.zoomParameter = 0
		}
	}
})

export const { chooseObjects, chooseMap, choosePoint, resetMap } = mapSlice.actions

export default mapSlice.reducer