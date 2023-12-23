import logo from './logo.svg';
import './App.css';
import Nav from './Components/Nav'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import SignUp from './Components/SignUp';
import PrivateComponent from './Components/PrivateComponent';
import Login  from './Components/Login';
import EmployeeList from './Components/EmployeeList';
import AddEmployee from './Components/AddEmployee';
import RedeemTony from './Components/RedeemTony';
import Users from './Components/Users';
import Demo from './Components/Demo';




function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>
      <Routes>
        <Route element={<PrivateComponent/>}>
        <Route path='/' element = {<EmployeeList/>}/>
        <Route path='/redeemtony' element={<RedeemTony/>}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/logout' element={<h1>Logout component</h1>}/>
        <Route path='/profile' element={<h1>Profile component</h1>}/>
        <Route path='/addEmp' element={<AddEmployee/>}/>
        </Route>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/demo' element = {<Demo/>}/>
      </Routes>
      <Footer/>
     </BrowserRouter>
     
    </div>
  );
}

export default App;
