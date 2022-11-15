import * as React from 'react';
import {Box, Grid, Alert, Typography} from '@mui/material';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LandscapeIcon from '@mui/icons-material/Landscape';
import GroupIcon from '@mui/icons-material/Group';
import ApprovalIcon from '@mui/icons-material/Approval';

import { useSelector } from "react-redux";


export default function MediaCard() {

	const totalArea = useSelector((state) => state.districts.chosenDistricts.reduce((currentTotal, item) => {
		return item.area + currentTotal
	}, 0))

	const totalPopulation = useSelector((state) => state.districts.chosenDistricts.reduce((currentTotal, item) => {
		return item.population + currentTotal
	}, 0))

	const chosenPoints = useSelector((state) => state.map.chosenObjects.length)

  return (
	<Box
		sx={{
		border: 0, 
		ml: 47,
		borderColor: '#bfbfbf',
		boxShadow: 0,
		borderRadius: 0,
		position: 'absolute',
		top: 167,
		backgroundColor: 'transparent',
		width: 865,
		p: 0,
		}}
	>
      <Grid container spacing={1}>
        <Grid item xs={6}>
		<Alert
		icon={<LandscapeIcon fontSize="inherit" />}
		sx={{
			borderRadius: 2,
			border: 2,
			borderColor: '#000000',
			backgroundColor: 'rgba(255,255,255,0.4)',
			color: '#000000',
			minWidth: 300,
			}}
		severity="error">
		<Typography align="center" sx={{fontSize: "15px", fontWeight: 'bold'}}>Площадь: {totalArea} км²</Typography>
		</Alert>
        </Grid>
        <Grid item xs={6}>
		<Alert
		icon={<EmojiPeopleIcon fontSize="inherit" />}
		sx={{
			borderRadius: 2,
			border: 2,
			borderColor: '#000000',
			backgroundColor: 'rgba(255,255,255,0.4)',
			color: '#000000',
			minWidth: 300,
			}}
		severity="error">
		<Typography align="center" sx={{fontSize: "15px", fontWeight: 'bold'}}>Население: {totalPopulation * 1000}</Typography>
		</Alert>
        </Grid>
        <Grid item xs={6}>
		<Alert
		icon={<GroupIcon fontSize="inherit" />}
		sx={{
			borderRadius: 2,
			border: 2,
			borderColor: '#000000',
			backgroundColor: 'rgba(255,255,255,0.4)',
			color: '#000000',
			minWidth: 300,
			}}
		severity="error">
		<Typography align="center" sx={{fontSize: "15px", fontWeight: 'bold'}}>Плотность: {Number((totalPopulation / totalArea * 1000).toFixed(1)) } ч/км²</Typography>
		</Alert>
        </Grid>
        <Grid item xs={6}>
		<Alert
		icon={<ApprovalIcon fontSize="inherit" />}
		sx={{
			borderRadius: 2,
			border: 2,
			borderColor: '#000000',
			backgroundColor: 'rgba(255,255,255,0.4)',
			color: '#000000',
			minWidth: 300,
			}}
		severity="error">
		<Typography align="center" sx={{fontSize: "15px", fontWeight: 'bold'}}>Мест для потенциальных постоматов: {chosenPoints} </Typography>
		</Alert>
        </Grid>
      </Grid>
	</Box>
  );
}


