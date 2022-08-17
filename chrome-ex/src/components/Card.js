const Card = ({ Term, Translation, Targetlanguage, Link, cardStyle }) => {
    return (
      <div className={cardStyle}>
            <h3>{Term}</h3>
            <a target="_blank" href={`https://${Targetlanguage}.wikipedia.org/wiki/${Link}`}>{Translation}</a>
      </div>
    );
  };
  
  export default Card;