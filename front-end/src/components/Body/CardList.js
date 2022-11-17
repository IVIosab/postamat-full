import React from "react";
import { Box, Grid, Card, Typography, CardActionArea, Divider, Alert} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { choosePoint, chooseSortedObjects } from "../../store/mapSlice";
import Slider from '@mui/material/Slider';

const types = {
	'kiosks':'Киоск',
	'gosuslugi':'Государственные Услуга',
	'libraries':'Библиотека',
	'sport':'Спортивный объект',
	'culture_clubs':'Дом Культуры'
};

export default function SimpleCard() {

  const dispatch = useDispatch()
  const mainPoints = useSelector((state) => state.map.chosenObjects)
  const chosenPoints = useSelector((state) => state.map.sortedChosenObjects)
  const [toFromValue, setToFromValue] = React.useState(100);
  const handleToFromChange = (event, newValue) => {
    setToFromValue(newValue);
	const newArray = []
	const lengthArr = mainPoints.length;
	mainPoints.forEach((elem, i) => {
		if( ((i / lengthArr) * 100) < newValue ){
			newArray.push(elem)
		}else{
			console.log('freevalue')
		}
	})
	dispatch(chooseSortedObjects(newArray))
  };

  return (
	<Grid     container
	direction="row"
	justifyContent="flex-start"
	alignItems="flex-start">
	<Grid xs item>
	    <Typography variant="h8"  sx={{fontSize: "16.2px", ml:0, fontWeight: 'bold'}} color="#000000" gutterBottom>
			<Grid container>
				<Grid item xs={4}>
					Выберите процентиль :
				</Grid>
				<Grid item xs={6}>
					<Slider sx={{ width: '95%' }} value={toFromValue} onChange={handleToFromChange}  min={0} max={100} color="secondary" aria-label="Default" valueLabelDisplay="auto" />
				</Grid>
			</Grid> 
	</Typography>
	</Grid>
	<Grid xs={12} item>
	</Grid>
	<Box
	sx={{
	border: 0, 
	borderColor: '#bfbfbf',
	backgroundColor: "#f9f9f9",
	maxHeight: "150px",
	overflowY: "scroll",
	boxShadow: 0,
	borderRadius: 2,
	p: 0,
	}}
	> 
    <Grid container spacing={1}>
        {chosenPoints.map((point, index) => {
          return (
            <Grid item sx={{height:'100%'}}xs={12}>
              <Card key={index}  sx={{
				border: 1, 
				borderColor: '#000000',
				bgcolor: '#f52e47',
				':hover': {
					bgcolor: '#f9f9f9', // theme.palette.primary.main
					color: '#000000',
					borderColor: '#000000',
					border: 2
					},
				backgroundColor: "white",
				boxShadow: 0,
				borderRadius: 2,
				minWidth: 300,
				}} >
				<CardActionArea onClick={() => {dispatch(choosePoint({'coordinates':[point.geometry.coordinates[1], point.geometry.coordinates[0]], 'zoom': 15}))}}>
				<Grid container spacing={0}>
					<Grid item xs={4}>
					<Alert
					sx={{
						borderRadius: 2,
						m: 2,
						border: 2,
						borderColor: '#000000',
						backgroundColor: 'rgba(255,255,255,0.4)',
						color: '#000000',
						width: '100%'
						}}
					severity="error">
					<Typography align="center" sx={{fontSize: "15px", fontWeight: 'bold'}}>
											Индекс: {Number((point.rating).toFixed(1))}
					</Typography>
					</Alert>
					<Divider orientation="vertical" />
					</Grid>
					<Grid item xs={8} sx={{mt:2.5}}>
								<Typography align="center" sx={{fontSize: "15px", fontWeight: 'bold'}}>
								Адрес: {point.address}
								</Typography>
								<Typography align="center" sx={{fontSize: "15px", fontWeight: 'bold'}}>
								Тип Обьекта: {types[point.type]}
								</Typography>
					</Grid>
				</Grid>
				</CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
	</Box>
	</Grid>
  );
}
