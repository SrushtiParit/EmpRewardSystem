import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { userData } from "../redux/loginSlice";
import AccountCircle from '@mui/icons-material/AccountCircle';


const Demo = () => {
    const [rows, setRows] = useState([]);
    const [imageSrc, setImageSrc] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const dispatch = useDispatch();
    const demoImage = useSelector(state=> state.user.image)

    useEffect(() => {
        // Convert the Buffer data to base64 string and set it as image source
        if (rows.length > 0) {
            // Assuming rows[0].photo.data is the array of integers
            const bufferData = rows[0].photo.data;
            const uint8Array = new Uint8Array(bufferData);
            const base64Image = btoa(String.fromCharCode.apply(null, uint8Array));

            setImageSrc(`data:image/png;base64,${base64Image}`);
        }
    }, [rows]);

    const bringImage = async () => {
        try {
            const response = await fetch('http://localhost:5000/allUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                const rowsWithPhoto = result.filter(row => row.photo);

                setRows(rowsWithPhoto);
            } else {
                const result = await response.json();
                alert(result.error);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsClicked(!isClicked);
        console.log(imageSrc);
        dispatch(userData({
            username: "JohnDoe",
            role: "admin",
            image: imageSrc,
        }));
    };

    return (
        <>
            <button style={{ marginTop: "100px" }} onClick={bringImage}>
                Click Here
            </button>
            <br />
            {isClicked? 
            <>
            <img
                src={demoImage}
                alt="User"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
            <AccountCircle style={{ fontSize: 50 }}/></>
: <></>}
            
        </>
    );
};

export default Demo;
