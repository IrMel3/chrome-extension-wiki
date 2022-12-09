import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import './Alerts.css'

/**
 * Alert component
 * @param {*} param0 
 * @returns 
 */

export default function Alerts({type, message, title, isOpen, handleClose}) {
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
