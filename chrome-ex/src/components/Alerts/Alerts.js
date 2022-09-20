import react, {useState, useEffect, useCallback} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import './Alerts.css'
import {
    faXmark
  } from "@fortawesome/free-solid-svg-icons";
import {Tooltip} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Alerts({type, message, title, isOpen, handleClose}) {
   /* const [show, setShow] = useState(true);

   useEffect(() =>{
     // setShow(!show)
      console.log(show)
    },[])


    const handleShow = () =>{
           setShow(!show);
           console.log("Clicked Close Alert" + show)
          // setShow(false);
           console.log(show);

    }
    useEffect(() =>{
      handleShow2();
    },[]);
    // here we added [isToggled, setIsToggled] as a second parameter
    const handleShow2 = useCallback(() => {
      setShow(!show);
      console.log(show)})

   //types: error, warning, info, success
     useEffect(() => {
    const timeId = setTimeout(() => {
      // After 5 seconds set the show value to false
      setShow(false)
    }, 5000)

    return () => {
      clearTimeout(timeId)
      setShow(true)
    }
  }, []); */

  return (
      <div>
      {isOpen ? 
    <div className="alert">
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity={type} onClose={handleClose}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Stack>
    </div> : <div></div>}</div>
  );
}
