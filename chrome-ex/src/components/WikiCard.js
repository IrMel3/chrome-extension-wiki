const WikiCard = ({ title, snippet, targetLanguage, pageid, cardStyle }) => {
    return (
      <div className={cardStyle} key={pageid}>
            <div className="content">
                    <h3 className="header">{title}</h3>
                    <span dangerouslySetInnerHTML={{__html:snippet}}></span><br/>
                    <span className='wikilink'><a target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${title}`}>{`https://${targetLanguage}.wikipedia.org/wiki/${title}`}</a></span>
                </div>
             </div>
    );
  };
  
  export default WikiCard;