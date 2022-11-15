import { useSelector, useDispatch } from "react-redux";
import { Grid , Box, Select, FormControl, MenuItem, ListItemText, Checkbox, OutlinedInput, Button, List, Chip, ListItem, Typography } from '@mui/material';
import * as React from 'react';
import axios from 'axios'

import { chooseTypes } from '../../store/districtsSlice';
import { chooseObjects, choosePoint } from "../../store/mapSlice";


import CardList from './CardList'

export default function BasicCard() {

	const totalData = useSelector((state) => state.districts)
	const chosenDistricts = useSelector((state) => state.districts.chosenDistricts);
	const chosenMap = useSelector((state) => state.map.mapReference);

	const dispatch = useDispatch()
	const types = [
		{label: 'Киоски',
		 type: 'kiosks'},
		{label: 'Государственные Услуги',
		 type: 'gosuslugi'},
		{label: 'Библиотеки',
		 type: 'libraries'},
		{label: 'Спортивные объекты',
		 type: 'sport'},
		{label: 'Дома Культуры',
		 type: 'culture_clubs'},
	];
	const [typeName, setTypeName] = React.useState([]);

	async function handleClick (name) {
		const districtNames = totalData.chosenDistricts.map((item) =>{
			return item.api_name
		})
		const districtTypes = totalData.chosenTypes.map((item) => {
			return item.type
		})
		
		if (chosenDistricts.length > 0){
			if ('parent_id' in chosenDistricts[0]){
				console.log('not administrative')
				const main_api = "https://postamat-api.vercel.app/api/postamat/district?district=" + districtNames.join('&district=') + '&type='+districtTypes.join('&type=') + '&model=' + name
				console.log(main_api)
				axios.get(main_api)
					.then(response => dispatch(chooseObjects(response.data)))
					.catch((error) => {
						console.error(error)
					})
			}
			else{
				console.log('administrative')
				const main_api = "https://postamat-api.vercel.app/api/postamat/admin?admin=" + districtNames.join('&admin=') + '&type='+districtTypes.join('&type=') + '&model=main'
				console.log(main_api)
				axios.get(main_api)
					.then(response => dispatch(chooseObjects(response.data)))
					.catch((error) => {
						console.error(error)
					})
			}
		}
	};

	const handleTypeChange = (event) => {
		const {
			target: { value },
		} = event;

		setTypeName(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
		const foundVariableName = types.filter((item) => {
			return event.target.value.includes(item.label)
		})
		console.log(event.target.value)
		console.log(foundVariableName)
		dispatch(chooseTypes(foundVariableName));
	};

  return (

	<Box
	sx={{
	border: 0, 
	height: "100%",
	width: '100%',
	borderColor: '#bfbfbf',
	backgroundColor: "#f9f9f9",
	boxShadow: 0,
	borderRadius: 2,
	p: 2,
	minWidth: 300,
	}}
	>
        <Typography sx={{fontSize: "18.5px", m:1, ml:0, fontWeight: 'bold'}} color="#000000" >
            Список выбранных районов : 
			<List
				sx={{
					mt: '1',
					width: '100%',
					bgcolor: 'transparent',
					position: 'relative',
					overflow: 'auto',
					maxHeight: 50,
					'& ul': { padding: 0 },
				}}
				subheader={<li />}
				>
					{chosenDistricts.map((data) => {
						return (
						<ListItem>
							<Chip
							sx={{
								fontSize: "15px",
								borderRadius: 2,
								border: 2,
								borderColor: '#000000',
								backgroundColor: 'rgba(255,255,255,0.4)',
								bgcolor: '#f52e47', // theme.palette.primary.main
								color: 'white',
								minWidth: '100%',
								':hover': {
										bgcolor: 'white', // theme.palette.primary.main
										color: '#000000',
										},
								}}
							variant="outlined"
							label={data.name}
							onClick={() => {dispatch(choosePoint({'coordinates':[data.center[0], data.center[1]], 'zoom': 11}))}}
							/>
						</ListItem>
						);
					})}
				</List>
        </Typography>
        
        <Typography sx={{fontSize: "18.5px", m:1, ml:0, fontWeight: 'bold'}} color="#000000" >
			<Grid container>
				<Grid item xs={6}>
				Выберите места для размещения постаматов :
				</Grid>
				<Grid item xs={6}>
				<FormControl sx={{ mt: 2, mb:2, width:'100%',  border: 0, borderRadius: 1  }}>
					<Select
							sx={{
								mt: '1',
								width: '100%',
								bgcolor: 'transparent',
								position: 'relative',
								overflow: 'auto',
								maxHeight: 50,
								border: 2,
								borderRadius: 1
							}}
						labelId="demo-multiple-chip-label"
						id="demo-multiple-chip"
						multiple
						value={typeName}
						onChange={handleTypeChange}
						renderValue={(selected) => selected.join(', ')}
						input={<OutlinedInput sx={{ border: 0, borderRadius: 1 }} />}
						>
						{types.map((name) => (
							<MenuItem key={name.label} value={name.label}>
							<Checkbox checked={typeName.indexOf(name.label) > -1} />
							<ListItemText primary={name.label} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				</Grid>
			</Grid>
        </Typography>

        <Typography sx={{fontSize: "18.5px", m:1, ml:0, fontWeight: 'bold'}} color="#000000">
            Выберите модель расчета Индикатора Восстребованности :
			<Button
				sx={{ 
				p: 2,
				m: 1,
				ml:0,
				border: 2,
				color: '#f9f9f9',
				fontSize: 15, 
				fontWeight: 'bold',
				borderRadius: 3,
				borderColor: '#000000',
				bgcolor: '#f52e47',
				':hover': {
					bgcolor: '#f9f9f9', // theme.palette.primary.main
					color: '#000000',
					borderColor: '#000000',
					border: 2
					},
				}}
				
				variant="outlined"
				fullWidth
				onClick={() => {handleClick('main')}}
			>
				Основная модель
			</Button>
			<Button
				sx={{ 
				p: 2,
				m: 1,
				ml:0,
				border: 2,
				color: '#f9f9f9',
				fontSize: 15, 
				fontWeight: 'bold',
				borderRadius: 3,
				borderColor: '#000000',
				bgcolor: '#f52e47',
				':hover': {
					bgcolor: '#f9f9f9', // theme.palette.primary.main
					color: '#000000',
					borderColor: '#000000',
					border: 2
					},
				}}
				onClick={() => {handleClick('Population')}}
				variant="outlined"
				fullWidth
			>
				Модель на основании плотности населения 
			</Button>
			<Button
				sx={{ 
				p: 2,
				m: 1,
				ml:0,
				border: 2,
				color: '#f9f9f9',
				fontSize: 15, 
				fontWeight: 'bold',
				borderRadius: 3,
				borderColor: '#000000',
				bgcolor: '#f52e47',
				':hover': {
					bgcolor: '#f9f9f9', // theme.palette.primary.main
					color: '#000000',
					borderColor: '#000000',
					border: 2
					},
				}}
				onClick={() => {handleClick('Traffic')}}
				variant="outlined"
				fullWidth
			>
				Модель на основании загружненности трафика
			</Button>
        </Typography>
		<Typography>
			<CardList/>
		</Typography>
    </Box>
  );
}
