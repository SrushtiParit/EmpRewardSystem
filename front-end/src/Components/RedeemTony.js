import React, { useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";
import { MenuItem, TablePagination, TableSortLabel } from "@mui/material";

const RedeemTony = () => {
  const [rows, setRows] = useState([]);
  const [redeemBox, setRedeemBox] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [emp, setEmp] = useState([]);
  const [balanceTony, setBalanceTony] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  


  const isFullScreen = useMediaQuery("(max-width:600px)");
  const role = useSelector(state=> state.user.role)

  const handleNameChange = (event) => {
    const selectedName = event.target.value;
    setSelectedName(selectedName);
    const selectedEmployee = emp.find((employee) => employee.name === selectedName);
    if (selectedEmployee) {
      setBalanceTony(selectedEmployee.balanceTony);
    } else {
      console.error("Selected name not found in the list.");
    }
  };

  const handleProductChange = (event)=>{
    const selectedProduct = event.target.value;
    setSelectedProduct(selectedProduct);
  };

  const handleRedeemSubmit = async ()=>{
    let result = await fetch("http://localhost:5000/redeem-tony",{
      method:'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({ selectedName, selectedProduct })
    });
    handleCloseRedeemBox();
  }

  const handleCloseRedeemBox = () => {
    setSelectedName("");
    setBalanceTony("");
    setProducts([]);
    getRedeem();
    setRedeemBox(false);
  };

  const newRedeem = async () => {
    const result = await fetch("http://localhost:5000/employee/",{
      method:'GET',
      headers:{
        "Content-Type": "application/json"
      }
    });
    const data = await result.json();
    setEmp(data);

    let products = await fetch("http://localhost:5000/products",{
      method:'GET',
      headers:{
        "Content-Type": "application/json"
      }
    });
    products = await products.json();
    setProducts(products);
    setRedeemBox(true);
  };

  const getRedeem = async () => {
    const result = await fetch("http://localhost:5000/redeem-history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    setRows(data);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  useEffect(() => {
    getRedeem();
  }, []);

  const columns = [
    {id:'name', label:'Name', minWidth:170},
    {id:'tonies', label:'Tonies', minWidth:170},
    {id:'product', label:'Product', minWidth:170},
    {id:'date', label:'Date', minWidth:170}
]

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};

  return (
    <div style={{ marginLeft: "300px", marginRight: "300px", marginTop: "30px" }}>
      <h3 style={{ float: "right", marginBottom: "10px" }}>Redeem History</h3>
      {role === 'admin'?
      <Button
      variant="outlined"
      onClick={newRedeem}
      style={{ float: "left", marginBottom: "10px" }}
    >
      Redeem new
    </Button>: <></>
      }
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
  {stableSort(rows, getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row) => (
      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align}>
            {column.format && typeof row[column.id] === 'number'
              ? column.format(row[column.id])
              : row[column.id]}
          </TableCell>
        ))}
      </TableRow>
    ))}
</TableBody>

        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>

      <Dialog
        open={redeemBox}
        onClose={handleCloseRedeemBox}
        fullScreen={isFullScreen}
        PaperProps={{
          style: {
            maxWidth: 'lg',
            width: '100%',
          },
        }}
      >
        <DialogTitle>Redeem Tony</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Name"
            value={selectedName}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
          >
            {emp.map((record) => (
              <MenuItem key={record._id} value={record.name}>
                {record.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Balance Tony"
            value={balanceTony}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Product and number of tonies required"
            value={selectedProduct}
            onChange={handleProductChange}
            fullWidth
            margin="normal"
            disabled={balanceTony < 50}
          >
            {products.map((record) => (
              <MenuItem key={record._id} value={record.name} disabled={balanceTony<record.tony}>
                {record.name +" "+ record.tony}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRedeemBox}>Cancel</Button>
          <Button
            onClick={handleRedeemSubmit}
            variant="contained"
            color="primary"
          >
            Redeem
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RedeemTony;