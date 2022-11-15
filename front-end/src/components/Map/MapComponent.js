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
import { chooseMap } from "../../store/mapSlice";
import { chooseCoordinates } from "../../store/radiusSlice";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const icon = new Icon({
  iconUrl: "/skateboarding.svg",
  iconSize: [25, 25]
});

const icons = {
	'kiosks': StorefrontIcon,
	'culture_clubs': StadiumIcon,
	'gosuslugi': AccountBalanceIcon,
	'sport': StadiumIcon,
};

export const fillBlueOptions = { fillColor: 'blue' }
export const blackOptions = { color: 'black' }


const MapComponent = () => {
  const dispatch = useDispatch()
  const [isToggled, setIsToggled] = React.useState(false);

  const chosenDistricts = useSelector((state) => state.districts.chosenDistricts);
  const chosenPoints = useSelector((state) => state.map.chosenObjects)
  const chosenPoint = useSelector((state) => state.map.chosenPoint);
  const chosenZoom = useSelector((state) => state.map.zoomParameter)

  const chosenRadius = useSelector((state) => state.radius.radius)
  const purpleOptions = { color: 'purple' };
  const [marker, setMarker] = React.useState({lat: 0, lng: 0});
  
  const mapRef = useRef();
  useEffect(() => {
    if(chosenPoint.length > 0){
		handleToFly(chosenPoint, chosenZoom)
	}
  });

  function changeUbication(e) {
		let {lat, lng} = e.latlng;
		console.info("Lat:", lat);
		console.info("Lng: ",lng);
		dispatch(chooseCoordinates([lat,lng]))
		console.log(e.latlng)
		setMarker(e.latlng);
	}

  function handleToFly(districtToFly, zoomParameter){
		const { current = {} } = mapRef;
		const { leafletElement: map } = current;
		map.setView(districtToFly, zoomParameter)
  }

  return (
		<Box sx={{ 
			width: '100%',
        	height: '100%',
			zIndex: 'modal',
			display: "flex",
 		    justifyContent:"flex-bottom",
            alignItems: "flex-bottom"
			}}
			display="flex-end"
			justifyContent="flex-bottom"
			alignItems="flex-bottom">
			<Map 
			 ref={mapRef}
			 center={[55.755825, 37.617298]}
             zoom={10}
			 id='mapComponent'
			 zIndex='modal'
             onClick={changeUbication}>
		    <TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			 />
			 <Button variant="contained" onClick={() => setIsToggled(!isToggled)} sx={{
					color: 'white',
					borderRadius: 3,
					borderColor: '#000000',
					bgcolor: '#f52e47',
					':hover': {
						bgcolor: '#f9f9f9', // theme.palette.primary.main
						color: '#000000',
						borderColor: '#000000',
						border: 2
						},
					display: 'block',
					zIndex: 'snackbar',
					mt: 80,
					fontSize: "8", 
					fontWeight: 'bold',
					ml: 70,
					width: 300
					}}>
					Тепловая карта : {isToggled ? 'активна' : 'не активна'}
					</Button>
			 {isToggled ? <Heatmap/>  : 'не активна'}
            {(marker.lat !== 0 && marker.lng !== 0) &&
            <Marker position={[marker.lat, marker.lng]}>
			<Circle 
                  center={{lat:marker.lat, lng: marker.lng}}
                  fillColor="blue" 
                  radius={chosenRadius}/>
            </Marker>}
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
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
				<Marker
				key={point._id}
				position={[point.geometry.coordinates[1],
						   point.geometry.coordinates[0]]}
				/>
			))}

			</Map>
		</Box>
  )
}

export default MapComponent