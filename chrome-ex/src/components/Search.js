import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Search = () => { 
  
    const [term, setTerm] = useState("React")
    const [results, setResults] = useState([])
    const [seeAlso, setSeeAlso] = useState([])

    //search links
    useEffect(() => {
        //search Wikipedia API
        const searchSA = async () => {
            const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
                params: {
                    action: "query",
                    prop: "links",
                    format: "json",
                    origin: "*",
                    titles: term,
                },
            })
            console.log(data);
            const keys = Object.keys(data.query.pages)
            console.log(data.query.pages[keys[0]].links)
            setSeeAlso(data.query.pages[keys[0]].links)
            
        }
        if (term && !seeAlso.length){
            searchSA();
        }else{
        let timeoutID = setTimeout(() =>{
        if(term){
        searchSA()
        }
    },1000);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [term])

    //search terms and descriptions
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
           // console.log(results);
        }
        if (term && !results.length){
            search();
        }else{
        let timeoutID = setTimeout(() =>{
        if(term){
        search()
        }
    },1000);
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
                    <span className='link'><a href={`https://en.wikipedia.org/wiki/${result.title}`}>{`https://en.wikipedia.org/wiki/${result.title}`}</a></span><br/>
                    <span dangerouslySetInnerHTML={{__html:result.snippet}}></span>

                </div>
            </div>
        )
    })

    const linksInArticle = seeAlso.map(link =>{
        return (
            <div>
            <span className='link'><a href={`https://en.wikipedia.org/wiki/${link.title}`}>{link.title}</a></span><br/>   
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
          <div>{linksInArticle}</div>
          <div className="ui celled list">{searchResultsMapped}</div>
      </div>
      )

}

export default Search;
