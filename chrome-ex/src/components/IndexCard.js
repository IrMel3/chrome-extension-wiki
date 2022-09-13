import Card from '@mui/material/Card';

const IndexCard = ({ handleMouseDown, term, translation, targetlanguage, link, cardStyle }) => {

  
    return (
      <Card style={{backgroundColor: "#d4e6f1", overflow: "visible", borderRadius: "15px"}}>
      <div className={cardStyle} onMouseDown={handleMouseDown}>
            <div>{term}</div>
            <h3><a target="_blank" href={`https://${targetlanguage}.wikipedia.org/wiki/${link}`}>{translation}</a></h3>
      </div>
      </Card>
    );
  };
  
  export default IndexCard;