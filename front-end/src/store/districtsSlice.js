import { createSlice } from "@reduxjs/toolkit";

const districtsSlice = createSlice({
	name: 'districts',
	initialState: {
		chosenDistricts : [],
		chosenTypes : []
	},
	reducers: {
		chooseDistricts(state, action) {
			state.chosenDistricts = action.payload
		},
		chooseTypes(state, action){
			state.chosenTypes = action.payload
		},
		resetDistrictsSlice(state, action){
			state.chosenDistricts = []
			state.chosenTypes = []
		}
	}
})

export const { chooseDistricts, chooseTypes, resetDistrictsSlice} = districtsSlice.actions

export default districtsSlice.reducer