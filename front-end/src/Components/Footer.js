import React, { useEffect, useState } from "react";
import { Box, Typography  } from "@mui/material";
import { useSelector } from 'react-redux';


const Footer = ()=>{
    const user = useSelector(state=> state.user)
    const [content, setContent] = useState(<></>);
    useEffect(()=>{
        links();
    },[]);

    useEffect(()=>{
        links();
    },[user]);
    
    const links = ()=>{
        user.role?
        setContent(
        <Box borderTop={1} borderColor="grey.300" position={"absolute"} bottom={0} width="100%" height={45}>
                    <Typography variant="h7" color="textSecondary">
            Copyright@2023. All rights reserved
          </Typography>
                </Box>)
                :
             setContent(<></>)
    } 
    
    return(
        content
    );
}
export default Footer;