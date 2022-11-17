import React, { useRef, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Map, Marker, Pane, Circle, TileLayer, Polygon } from "react-leaflet";
import { Icon } from "leaflet";
import Heatmap from "./Heatmap";
import { useSelector, useDispatch } from "react-redux";
import "./Map.css";
import StadiumIcon from '@mui/icons-material/Stadium';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Box, Button, Typography } from '@mui/material';
import { chooseMap, chooseFromTo, resetMap } from "../../store/mapSlice";
import { chooseCoordinates } from "../../store/radiusSlice";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Grid } from '@mui/material';
import Slider from '@mui/material/Slider';
import {Input} from "@mui/material";
import VolumeUp from '@mui/icons-material/VolumeUp';
import L from 'leaflet'
import { maxHeight } from "@mui/system";

const humanIcon = new L.Icon({
	iconUrl: require("../../assets/human.svg"),
	iconSize: [40,40]
})

const kioskIcon = new L.Icon({
	iconUrl: require("../../assets/kiosk.svg"),
	iconSize: [35,45]
})

const clubIcon = new L.Icon({
	iconUrl: require("../../assets/club.svg"),
	iconSize: [35,45]
})

const libraryIcon = new L.Icon({
	iconUrl: require("../../assets/library.svg"),
	iconSize: [35,45]
})

const gosuslugiIcon = new L.Icon({
	iconUrl: require("../../assets/government.svg"),
	iconSize: [35,45]
})

const sportIcon = new L.Icon({
	iconUrl: require("../../assets/sport.svg"),
	iconSize: [35,45]
})


const icons = {
	'kiosks': kioskIcon,
	'culture_clubs': clubIcon,
	'libraries': libraryIcon,
	'gosuslugi': gosuslugiIcon,
	'sport': sportIcon
};

export const fillBlueOptions = { fillColor: 'blue' }
export const blackOptions = { color: 'black' }


const MapComponent = () => {
  const dispatch = useDispatch()
  const [isToggled, setIsToggled] = React.useState(false);

  const chosenDistricts = useSelector((state) => state.districts.chosenDistricts);
  const chosenPoints = useSelector((state) => state.map.sortedChosenObjects)
  const chosenPoint = useSelector((state) => state.map.chosenPoint);
  const chosenZoom = useSelector((state) => state.map.zoomParameter)

  const chosenRadius = useSelector((state) => state.radius.radius)
  const chosenCoordinates = useSelector((state) => state.radius.coordinates)
  const chosenToFrom = useSelector((state) => {return [state.map.from, state.map.to]})
  const purpleOptions = { color: 'purple' };
  const [marker, setMarker] = React.useState({lat: 0, lng: 0});
  const [toFromValue, setToFromValue] = React.useState([0,100]);
  const chosenOption = useSelector((state) => state.map.option)

  const handleToFromChange = (event, newValue) => {
    setToFromValue(newValue);
	dispatch(chooseFromTo(newValue))
  };

  
  const mapRef = useRef();
  useEffect(() => {
    if(chosenPoint.length > 0){
		handleToFly(chosenPoint, chosenZoom)
	}
  });

  function changeUbication(e) {
	if(chosenOption === 1){
		let {lat, lng} = e.latlng;
		console.info("Lat:", lat);
		console.info("Lng: ",lng);
		dispatch(resetMap())
		dispatch(chooseCoordinates([lat,lng]))
	}else{
		console.log('not allowed')
	}
	}

  function handleToFly(districtToFly, zoomParameter){
		const { current = {} } = mapRef;
		const { leafletElement: map } = current;
		map.setView(districtToFly, zoomParameter)
  }

  function valuetext(toFromValue) {
	return `${toFromValue}°C`;
  }

  return (
			<Grid container padding={0} spacing={1} direction="column">
				<Grid  container
				direction="row"
				justifyContent="center"
				alignItems="center" >
					<Grid item xs={6}>
						<Switch
						checked={isToggled}
						onChange={() => setIsToggled(!isToggled)}
						inputProps={{ 'aria-label': 'controlled' }}
						label='Тепловая карта'
						color="secondary"
						/>
						Тепловая карта : {isToggled ? 'активна' : 'не активна'}
					</Grid>
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="center">
								<Grid item>
								<Typography variant="h8" gutterBottom>
									Выберите разброс:
								</Typography>
								</Grid>
								<Grid item xs>
								<Slider
								value={toFromValue}
								onChange={handleToFromChange}
								color="secondary"
								valueLabelDisplay="auto"
								/>
								</Grid>
								<Grid item>
								<Typography variant="subtitle1" gutterBottom>
									От
								</Typography>
								</Grid>
								<Grid item>
								<Input
									value={toFromValue[0]}
									disabled
									size="small"
									inputProps={{
									step: 10,
									min: 0,
									max: 100,
									type: 'number',
									'aria-labelledby': 'input-slider',
									}}
								/>
								</Grid>
								<Grid item>
								<Typography variant="subtitle1" gutterBottom>
									до 
								</Typography>
								</Grid>
								<Grid item>
								<Input
									value={toFromValue[1]}
									disabled
									size="small"
									inputProps={{
									step: 10,
									min: 0,
									max: 100,
									type: 'number',
									'aria-labelledby': 'input-slider',
									}}
								/>
								</Grid>
							</Grid>
					</Grid>
				</Grid>
				<Grid xs={12}>
					<Map 
					ref={mapRef}
					id="mapComponent"
					center={[55.755825, 37.617298]}
					zoom={10}
					zIndex='modal'
					onClick={changeUbication}>
					<TileLayer
						url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
					/>
					{isToggled ? <Heatmap/>  : 'не активна'}
					{(chosenCoordinates[0] !== 0 && chosenCoordinates[1] !== 0) &&
					<Marker icon={humanIcon} position={[chosenCoordinates[0], chosenCoordinates[1]]}>
					<Circle 
						center={{lat:chosenCoordinates[0], lng:chosenCoordinates[1]}}
						fillColor="blue" 
						radius={chosenRadius}/>
					</Marker>}
					<Pane name="custom" style={{ zIndex: 100 }}>
						<Circle center={[55.755825, 37.617298]} radius={100} />
					</Pane>

					{chosenDistricts.map(district => (
						<Polygon
						positions={
							district.polygon
						}
						onClick={() => {
							handleToFly(district.center, 12);
						}}
						pathOptions={purpleOptions}
						/>
					))}

					{chosenPoints.map(point => (
						!isToggled && (point.rating > chosenToFrom[0]) && (point.rating < chosenToFrom[1]) && <Marker
						key={point._id}
						icon={icons[point.type]}
						position={[point.geometry.coordinates[1],
								point.geometry.coordinates[0]]}
						/>
					))}

					</Map>
				</Grid>
			</Grid>
  )
}

export default MapComponent