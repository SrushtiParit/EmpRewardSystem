import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CachedIcon from '@mui/icons-material/Cached';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import AddEmployee from './AddEmployee';
import { useSelector } from 'react-redux';



const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = React.useState(false);
  const [name, setname] = useState('');
  const [tonies, setTonies] = useState(0);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("Allocated");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const[details, setDetails] = useState([]);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(null);
  const [isAddEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [errors, setErrors] = useState({});  
  const role = useSelector(state=> state.user.role);


  const handleDetailsOpen =  async (name) => {
    setname(name);
    let result = await fetch(`http://localhost:5000/tonyDetails/${name}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    result= await result.json();
    setDetails(result);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setname(null);
  };

    const handleEdit = (editId, tony, editreason)=>{
      setDetailsOpen(false);
      setTonies(tony);
      setReason(editreason);
      setId(editId);
      setEdit(true);     
      setOpen(true);
    }

   const handleUpdateTony = async()=>{
    const validationErrors = validateForm();
    const initialTony = tonies;
    if (Object.keys(validationErrors).length === 0){
      const updateTony = await fetch(`http://localhost:5000/edittony/${id}`,{
        method:'PUT',
        body: JSON.stringify({name, reason,initialTony, tonies, status}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if(updateTony)
      {
        setEdit(false);     
        setOpen(false);
        getemployees();
      }
    }
    else
    {
      setErrors(validationErrors);
    }   
   }

  const handleClickOpen = (name) => {
    setname(name);
    setOpen(true);
  };

  const handleAddNew = () => {
    setAddEmployeeOpen(true);
  }

  const handleCloseAddEmployee = () => {
    setAddEmployeeOpen(false);
  }

  const handleClose = async () => {
    setTonies(0);
    setReason(null);
    setOpen(false);
    setErrors({});
  };

  const handleAddTony = async () =>{
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0){
      const initialTony = tonies;
      const result = await fetch('http://localhost:5000/addTony',{
        method: 'POST',
        body: JSON.stringify({ name, reason, initialTony, tonies, status}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setTonies(0);
      setReason(null);
      setOpen(false);
    }
    else
    {
      setErrors(validationErrors);
    }
    
  }

  const handleRefresh =()=>{
    setSearchValue('');
    getemployees();
  };
  
  useEffect(() => {
  getemployees();
  }, [searchValue, employees])

  const getemployees = async () => {
    const result = await fetch(`http://localhost:5000/employee/${searchValue}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await result.json();
    setEmployees(data);
  }

  const validateForm = () => {
    const errors = {};
    if (!name) {
      errors.name = 'Name is required';
    }
    if (!reason) {
      errors.reason = 'Reason is required';
    }
    
    if (!tonies) {
      errors.tonies = 'Tonies is required';
    }
    return errors;
  };


 

  const columns = [
    { field: '_id', headerName: 'Employee ID', width: 270 },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'email', headerName: 'Email', width: 170 },
    { field: 'phone', headerName: 'Phone', width: 170 },
    {field:'balanceTony', headerName:'Balance Tony', width:170},
    {
      field: 'actions',
      headerName: 'Actions',
      width: 210,
      renderCell: (params) => (
        <div>
          {role === 'manager'?
          <Button
          size='medium'
          color="primary"
          onClick={()=>handleClickOpen(params.row.name)}
        >
          Add Tony
        </Button>:<></>
          }
          
      <Button
        size='medium'
        color="secondary"
        onClick={()=>handleDetailsOpen(params.row.name)}
      >
        Details
      </Button>
        </div>
      ),
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingTop:'18px' }}>
  <Button
    variant="outlined"
    color="primary"
    width = '600'
    onClick={() => handleAddNew()}
  >
    Add Emp
  </Button>
  <AddEmployee isOpen={isAddEmployeeOpen} onClose={handleCloseAddEmployee} />
  <Paper
    component="form"
    sx={{ display: 'flex', alignItems: 'right', width: 600, marginLeft:'40px' }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder="Search"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={getemployees}>
      <SearchIcon />
    </IconButton>
    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
    <IconButton color="primary" sx={{ p: '10px' }} onClick={handleRefresh}>
      <CachedIcon />
    </IconButton>
  </Paper>
</div>

     <br/>
      <div style={{ height: '60%', width: '80%', alignItems: 'center' }}>
        <DataGrid
          rows={employees}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          style={{ height: '400px' }} 
          pageSizeOptions={[5, 10, 15]}
          //checkboxSelection
        />
        
      </div>

      <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tony Allocation</DialogTitle>
        <DialogContent>
        <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Name"
        type="text"
        fullWidth
        variant="standard"
        InputProps={{ readOnly: true }}
        value= {name}
        error={!!errors.name}
        helperText={errors.name}
        />
        <TextField
        margin="dense"
        id="reason"
        label="Reason for Tony"
        type="text"
        value={reason}
        onChange={(e)=> setReason(e.target.value)}
        fullWidth
        variant="standard"
        error={!!errors.reason}
        helperText={errors.reason}
        />

        <TextField
        margin="dense"
        id="tonies"
        label="Number of Tonies"
        select
        fullWidth
        variant="standard"
        value={tonies}
        onChange={(e)=> setTonies(e.target.value)}
        error={!!errors.tonies}
        >
       <MenuItem value = {50}>
            50
        </MenuItem>
        <MenuItem value = {100}>
            100
        </MenuItem>
        <MenuItem value = {150}>
            150
        </MenuItem>
        </TextField>
        {errors.tonies && <span style={{ color: 'red' }}>{errors.tonies}</span>}
        </DialogContent>
        <DialogActions>
        {edit ? (
            <Button onClick={handleUpdateTony}>Update</Button>
            
          ) : (
            <Button onClick={()=>handleAddTony()}>Add</Button>
          )}
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

    <React.Fragment>
  <Dialog open={detailsOpen} onClose={handleDetailsClose} fullWidth maxWidth="sm">
    <DialogTitle>Employee Details</DialogTitle>
    <DialogContent>
      <TableContainer component={Paper}>
        <Table aria-label="Employee Details">
          <TableHead>
            <TableRow>
              <TableCell>Number of Tony</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              {role === 'manager'?
               <TableCell>Edit</TableCell>:<></>
              }
              
            </TableRow>
          </TableHead>
          <TableBody>
          {details.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record.initialTony}</TableCell>
              <TableCell>{record.reason}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.status}</TableCell>
              {record.status === 'Allocated' && role ==='manager' ? ( // Check if status is 'Allocated'
                <TableCell>
                  <IconButton
                    color="primary"
                    aria-label="Edit"
                    onClick={() => handleEdit(record._id,record.tonies, record.reason)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              ) : (
                <TableCell></TableCell> // Empty cell if status is not 'Allocated'
              )}
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDetailsClose}>Close</Button>
    </DialogActions>
  </Dialog>
</React.Fragment>

    </div>

  )
}

export default EmployeeList;