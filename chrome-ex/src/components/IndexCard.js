import Card from '@mui/material/Card';

const IndexCard = ({ handleMouseDown, term, translation, targetlanguage, link, cardStyle }) => {

  
    return (
      <Card>
      <div className={cardStyle} onMouseDown={handleMouseDown}>
            <h3>{term}</h3>
            <a target="_blank" href={`https://${targetlanguage}.wikipedia.org/wiki/${link}`}>{translation}</a>
      </div>
      </Card>
    );
  };
  
  export default IndexCard;