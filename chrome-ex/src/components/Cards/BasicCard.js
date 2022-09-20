import React,{useContext} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { UserContext } from '../Contexts/UserContext';
import axios from 'axios';


export default function BasicCard({ title, snippet, targetLanguage, pageid, cardStyle }) {

  const {user, setUser} = useContext(UserContext);
   

  const sendLog = (action) =>{
    let timestamp = new Date();
        let dictionaryData = {
            user: user,
            timestamp: timestamp,
            action: action,
        }
        axios
            .post("http://localhost:3000/addLog", dictionaryData)
            .then(data => console.log(data))
            .catch(error => console.log(error))
    
}



  return (
    <Card className={cardStyle} key={pageid} sx={{backgroundColor: "#d4e6f1", borderRadius: "15px"}}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body3">
        <span dangerouslySetInnerHTML={{__html:snippet}}></span><br/>
        </Typography>
      </CardContent>
      <CardActions>
      <Button className='wikilink' size="small" onClick={(e) => {e.preventDefault();window.open(`https://${targetLanguage}.wikipedia.org/wiki/${title}`, "_blank"); sendLog("Clicked on Wiki Card Read More: " + title)}}>Read More</Button>
      </CardActions>
    </Card>
  );
}
