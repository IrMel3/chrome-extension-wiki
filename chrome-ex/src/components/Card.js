const Card = ({ handleMouseDown, term, translation, targetlanguage, link, cardStyle }) => {
  
    return (
      <div className={cardStyle} onMouseDown={handleMouseDown}>
            <h3>{term}</h3>
            <a target="_blank" href={`https://${targetlanguage}.wikipedia.org/wiki/${link}`}>{translation}</a>
      </div>
    );
  };
  
  export default Card;