import * as React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import FilterDistrict from './FilterDistrict'
import FilterRadius from './FilterRadius'
import { useDispatch } from "react-redux"
import { resetDistrictsSlice } from '../../store/districtsSlice'
import { resetRadiusSlice } from '../../store/radiusSlice'
import { chooseOption, resetMap } from '../../store/mapSlice'
import {AnimatePresence, motion} from "framer-motion/dist/framer-motion"; 

function TabPanel(props) {

  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, mt: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch()

  const handleChange = (event, newValue) => {
	dispatch(resetDistrictsSlice())
	dispatch(resetRadiusSlice())
	dispatch(resetMap())
	dispatch(chooseOption(newValue))
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
	<motion.div
		initial={{y: 1000, opacity: 0}}
		animate={{y: 0, opacity: 1}}
		>
      <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
        <Tabs 
		sx={{'&.Mui-selected': {
						color: '#f52e47',
						fontWeight: 'bold',
					},}}
		textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
		value={value} centered onChange={handleChange}>
          <Tab
		   sx={{
			textTransform: 'none',
			minWidth: 0,
			fontSize: '18.5px',
			fontWeight: 'bold',
			color: 'rgba(0, 0, 0, 0.85)',
			fontFamily: [
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			].join(','),
			'&:hover': {
				color: '#f52e47',
				opacity: 1,
			},
			'&.Mui-selected': {
				color: '#040404',
				fontWeight: 'bold',
			},
			'&.Mui-focusVisible': {
				backgroundColor: '#d1eaff',
			},
		   }}
		   label="Поиск по районам и округам"  />
          <Tab 
		  	sx={{
			textTransform: 'none',
			minWidth: 0,
			fontSize: '18.5px',
			fontWeight: 'bold',
			color: 'rgba(0, 0, 0, 0.85)',
			fontFamily: [
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			].join(','),
			'&:hover': {
				color: '#f52e47',
				opacity: 1,
			},
			'&.Mui-selected': {
				color: '#040404',
				fontWeight: 'bold',
			},
			'&.Mui-focusVisible': {
				backgroundColor: '#d1eaff',
			},
		}}
		  label="Поиск по точке с радиусом" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <FilterDistrict/>
      </TabPanel>
      <TabPanel value={value} index={1}>
	    <FilterRadius/>
      </TabPanel>
	  </motion.div>
    </Box>
  );
}
