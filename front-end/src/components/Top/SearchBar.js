import * as React from 'react';
import { Box, Grid, Autocomplete, TextField } from '@mui/material';
import { ReactComponent as Text }from '../../assets/logo.svg';
import Statistics from './Statistics';
import { useDispatch } from 'react-redux';
import customData from '../../data/administrative'
import { chooseDistricts } from '../../store/districtsSlice';

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top



export default function BasicCard() {
	const [value, setValue] = React.useState('');
	const [inputValue, setInputValue] = React.useState('');
	const [customChangedData, setCustomChangedData] = React.useState(customData)
	const dispatch = useDispatch()

	const handleChange = (event) => {
		if (event.length === 1){
			// if length is one, we need to understand 
			// wether it's a district or administrative district
			// providing a new list of districts to pick from 
			console.log(event)
			const foundItem = customChangedData.find((item) => {
				return event[0].name === item.name
			})
			if ('parent_id' in foundItem){
				const usualDistricts = customChangedData.filter((item) =>{
					return 'parent_id' in item
				})
				setCustomChangedData(usualDistricts)
			}
			else{
				const adminDistricts = customChangedData.filter((item) =>{
					return !('parent_id' in item)
				})
				setCustomChangedData(adminDistricts)
			}
			dispatch(chooseDistricts(event))

		}
		else if(event.length === 0){
			setCustomChangedData(customData)
			dispatch(chooseDistricts(event))
		}
		else{
			dispatch(chooseDistricts(event))
		}

	  };
  return (
	<Box sx={{ border: 0,  m: 0}} >
		<Grid container padding={0} spacing={0}>
			<Grid item sx={{ mt: 2}} xs={2}>
				<Text height={270} width={300} />
			</Grid>
			<Grid item xs={10}>
				<Grid container padding={0} spacing={1.5}>

					<Grid item xs={12}>
						<Autocomplete
						multiple
						sx={{ 
							mt: 12,
							zIndex: 'tooltip',
							border: 0,
							borderRadius: 3,
							borderColor: '#000000',
							"& input::placeholder": {
								fontSize: "25px"
								}
							}}
						limitTags={3}
						options={customChangedData}
						onInputChange={(event, newInputValue) => {
							setInputValue(newInputValue);
						}}
						onChange={(event, newValue) => {
							setValue(newValue);
							handleChange(newValue);
						}}
						getOptionLabel={(option) => option.name}
						renderInput={(params) => (
							<TextField {...params} 
							variant="standard"
							sx={{ 
								zIndex: 'tooltip',
								borderBottom: 3,
								borderColor: '#000000',
								backgroundColor: "#f9f9f9",
								}}
							placeholder="Выберите административные округа или районы города " />
						)}
						/>
					</Grid>


					<Grid item xs={12}>
						<Statistics/>
					</Grid>

				</Grid>
			</Grid>
		</Grid>	
		</Box>
  );
}