import Card from '@mui/material/Card';

const IndexCard = ({ handleMouseDown, term, translation, targetlanguage, link, cardStyle }) => {

  
    return (
      <Card style={{backgroundColor: "#d4e6f1", overflow: "visible"}}>
      <div className={cardStyle} onMouseDown={handleMouseDown}>
            <h3>{term}</h3>
            <a target="_blank" href={`https://${targetlanguage}.wikipedia.org/wiki/${link}`}>{translation}</a>
      </div>
      </Card>
    );
  };
  
  export default IndexCard;