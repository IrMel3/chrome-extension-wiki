const WikiCard = ({ title, snippet, targetLanguage, pageid, cardStyle }) => {
    return (
      <div className={cardStyle} key={pageid}>
            <div className="content">
                    <h3 className="header">{title}</h3>
                    <span className='link'><a target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${title}`}>{`https://${targetLanguage}.wikipedia.org/wiki/${title}`}</a></span><br/>
                    <span dangerouslySetInnerHTML={{__html:snippet}}></span>
                </div>
             </div>
    );
  };
  
  export default WikiCard;