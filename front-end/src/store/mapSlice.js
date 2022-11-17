import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
	name: 'map',
	initialState: {
		chosenObjects : [],
		sortedChosenObjects: [],
		chosenPoint : [],
		zoomParameter: 0, 
		option: 0,
		limit: 0,
		from: 0,
		to: 100
	},
	reducers: {
		chooseSortedObjects(state, action){
			state.sortedChosenObjects = action.payload
		},
		chooseObjects(state, action) {
			state.chosenObjects = action.payload
			state.sortedChosenObjects = action.payload
		},
		chooseMap(state, action){
			state.mapReference = action.payload
		},
		chooseOption(state,action){
			state.option = action.payload
		},
		choosePoint(state, action){
			state.chosenPoint = action.payload.coordinates
			state.zoomParameter = action.payload.zoom
		},
		chooseLimit(state, action){
			state.limit = action.payload
		},
		chooseFromTo(state, action){
			state.from = action.payload[0]
			state.to = action.payload[1]
		},
		resetMap(state, action){
			state.chosenObjects = []
			state.chosenPoint = []
			state.sortedChosenObjects = []
			state.zoomParameter = 0
			state.limit = 0
			state.from = 0
			state.to = 100
		}
	}
})

export const { chooseObjects, chooseOption, chooseMap, chooseSortedObjects, choosePoint, resetMap, chooseLimit, chooseFromTo} = mapSlice.actions

export default mapSlice.reducer