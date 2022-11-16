import { createSlice } from "@reduxjs/toolkit";

const radiusSlice = createSlice({
	name: 'radius',
	initialState: {
		coordinates: [0,0],
		radius : 0,
		chosenTypes : []
	},
	reducers: {
		chooseCoordinates(state,action) {
			state.coordinates = action.payload
		},
		chooseRadius(state, action) {
			state.radius = action.payload
		},
		chooseTypes(state, action) {
			state.chosenTypes = action.payload
		},
		resetRadiusSlice(state, action){
			state.coordinates = [0,0]
			state.radius = 0
			state.chosenTypes = []
		}
	}
})

export const {chooseRadius, chooseTypes, chooseCoordinates, resetRadiusSlice} = radiusSlice.actions

export default radiusSlice.reducer