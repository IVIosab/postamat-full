import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from "react-redux";
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas'

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const chosenPoints = useSelector((state) => state.map.chosenObjects)
  const open = Boolean(anchorEl);
  
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(chosenPoints);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "statistics.xlsx");
  };

  const exportPDF = () => {
	const input = document.getElementById("mapComponent")
	html2canvas(input, {logging: true, letterRendering: 2, useCORS: true}).then(canvas => {
	  const imgWidth = 208;
	  const imgHeight = canvas.height * imgWidth / canvas.width;
	  const imgData = canvas.toDataURL('img/png');
	  const pdf = new JsPDF('p', 'mm', 'a4');
	  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
	  pdf.save("something.pdf")
	})
  }

  const handleClickFirst= (event) => {
    downloadExcel()
  };
  const handleClickSecond =(event) =>{
	exportPDF()
  }

  return (
    <div>
	<Grid container spacing={2}>
		<Grid item xs={6}>
			<Button
			sx={{ 
				p: 2,
				mt: 0,
				border: 2,
				minWidth: 300,
				color: 'white',
				fontSize: 14, 
				fontWeight: 'bold',
				borderRadius: 3,
				borderColor: '#000000',
				bgcolor: '#f52e47',
				':hover': {
					bgcolor: '#f9f9f9', // theme.palette.primary.main
					color: '#000000',
					borderColor: '#000000',
					border: 2
					}
				}}
			
			variant="outlined"
			fullWidth
			id="basic-button"
			aria-controls={open ? 'basic-menu' : undefined}
			aria-haspopup="true"
			aria-expanded={open ? 'true' : undefined}
			onClick={handleClickFirst}
		>
			Выгрузить информацию в формате EXCEL
		</Button>
		</Grid>
		<Grid item xs={6}>
			<Button
			sx={{ 
				p: 2,
				mt: 0,
				border: 2,
				minWidth: 300,
				color: 'white',
				fontSize: 14, 
				fontWeight: 'bold',
				borderRadius: 3,
				borderColor: '#000000',
				bgcolor: '#f52e47',
				':hover': {
					bgcolor: '#f9f9f9', // theme.palette.primary.main
					color: '#000000',
					borderColor: '#000000',
					border: 2
					}
				}}
			
			variant="outlined"
			fullWidth
			id="basic-button"
			aria-controls={open ? 'basic-menu' : undefined}
			aria-haspopup="true"
			aria-expanded={open ? 'true' : undefined}
			onClick={handleClickSecond}
		>
			Выгрузить информацию в формате PDF
		</Button>
		</Grid>
	</Grid>
    </div>
  );
}