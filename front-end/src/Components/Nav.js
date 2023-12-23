import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tab, Tabs, Button, Menu, MenuItem, Box } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';

const Nav = () => {
    const user = useSelector(state=> state.user)
    const [profile, setProfile] = useState("Profile");
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        if (user) {
            setProfile(user.name);
            setRole(user.role);
            if(user.image)
            {
                setImageSrc(user.image);
            }
        } else {
            setProfile("Profile");
        }
    }, [user]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
       // document.cookie = 'userRole=; path=/; secure; samesite=strict';
        sessionStorage.clear();
        setProfile('Profile');
        setRole('');
        setImageSrc('');
        navigate('/login');
        handleClose();
    };
    const handleSignup = () => {
       // document.cookie = 'userRole=; path=/; secure; samesite=strict';
        sessionStorage.clear();
        setProfile('Profile');
        setRole('');
        setImageSrc('');
        navigate('/signup');
        handleClose();
    };

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };


    const links = role!==''?
    <Box borderBottom={1} borderColor="grey.300">
            <Tabs value={activeTab} onChange={handleChangeTab} variant="standard">
                <Tab label="LOGO" disabled style={{fontFamily:"cursive", fontSize:"30px"}}/>
                <Tab label="Employees" component={Link} to="/" style={{ textDecoration: 'none' }}/>
                <Tab label="Redeem Tony" component={Link} to="/redeemtony" style={{ textDecoration: 'none' }}/>
                <Tab label="Users" component={Link} to="/users" style={{ textDecoration: 'none' }}/>
                <div style={{marginTop:"5px", marginLeft:"970px"}}> 
                {imageSrc?
                <img
                src={imageSrc}
                alt="User"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                onClick={handleClick}
                />:
                <AccountCircle style={{ fontSize: 50 }} onClick={handleClick}/>
                }  
                    
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem disabled>{profile} ({role})</MenuItem>
                        <MenuItem onClick={handleSignup}>Sign-Up</MenuItem>
                        <MenuItem onClick={handleLogout}>Switch Account</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
                </Tabs>
            </Box>
            :
            <>
            </>
    return (
        links
    );
}

export default Nav;
