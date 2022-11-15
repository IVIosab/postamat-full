import React from "react";
import MapComponent from "./components/Map/MapComponent";
import UltimateFilter from "./components/Body/UltimateFilter";
import SearchBar from "./components/Top/SearchBar"
import Download from './components/Map/Download'
import { Grid, createTheme, Container, ThemeProvider, CssBaseline, Divider } from '@mui/material';


function App() {
  const theme = createTheme({
	palette: {
		type: 'light',
		primary: {
		  main: '#3f51b5',
		},
		secondary: {
		  main: '#f50057',
		},
		background: {
		  default: '#f9f9f9',
		  paper: '#ffffff',
		},
	  }
  })

  return (
	<ThemeProvider className="App"  id="App" theme={theme}>
		<CssBaseline/>
		<Container  id='containerId' maxWidth={'xl'}>
			<Grid container padding={0} spacing={0}>
			
						<Grid item xs={12} >
								<SearchBar/>
						</Grid>
	
						 <Divider/>
						
						<Grid item xs={5}>
									<UltimateFilter/>
						</Grid>

						<Grid item xs={7}>
							<Grid container padding={0} spacing={1}>

								<Grid item id="mapComponent" xs={12}>
									<MapComponent/>
								</Grid>

								<Grid item xs={12}>
									<Download/>
								</Grid>

							</Grid>
						</Grid>
						
			</Grid>

		</Container>
	</ThemeProvider>
  );
}

export default App
