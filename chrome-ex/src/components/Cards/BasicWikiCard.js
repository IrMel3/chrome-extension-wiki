import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function BasicWikiCard({ title, snippet, targetLanguage, pageid, cardStyle }) {
  return (
    <Card className={cardStyle} key={pageid} sx={{backgroundColor: "#d4e6f1", borderRadius: "15px", marginTop: "5px"}}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body3">
        <span dangerouslySetInnerHTML={{__html:snippet}}></span><br/>
        </Typography>
      </CardContent>
      <CardActions>
      <Button className='wikilink' size="small" onClick={(e) => {e.preventDefault();window.open(`https://${targetLanguage}.wikipedia.org/wiki/${title}`, "_blank")}}>Read More</Button>
      </CardActions>
    </Card>
  );
}
