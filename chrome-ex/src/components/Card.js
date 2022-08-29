const Card = ({ term, translation, targetlanguage, link, cardStyle }) => {
    return (
      <div className={cardStyle}>
            <h3>{term}</h3>
            <a target="_blank" href={`https://${targetlanguage}.wikipedia.org/wiki/${link}`}>{translation}</a>
      </div>
    );
  };
  
  export default Card;