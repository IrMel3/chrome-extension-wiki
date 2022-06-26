import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Search = () => { 
  
    const [term, setTerm] = useState("React")
    const [results, setResults] = useState([])

    
    useEffect(() => {
        //search Wikipedia API
        const search = async () => {
            const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
                params: {
                    action: "query",
                    list: "search",
                    origin: "*",
                    format: "json",
                    srsearch: term,
                },
            })
            setResults(data.query.search)
            console.log(results);
        }
        if (term && !results.length){
            search();
        }else{
        let timeoutID = setTimeout(() =>{
        if(term){
        search()
        }
    },500);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [term])

   

    const searchResultsMapped = results.map(result =>{
        return(
            <div className="item" key={result.pageid}>
                <div className="content">
                    <h3 className="header">{result.title}</h3>
                    <span className='link'><a href={`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${result.pageid}&inprop=url&format=json`}>{`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${result.pageid}&inprop=url&format=json`}</a></span>
                    <span dangerouslySetInnerHTML={{__html:result.snippet}}></span>

                </div>
            </div>
        )
    })

    

    return(
      <div>
          <div className="ui-form">
              <div className="field">
                  <label>Search Term</label>
                  <input className="input"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  />
              </div>
          </div>
          <div className="ui celled list">{searchResultsMapped}</div>
      </div>
      )

}

export default Search;
