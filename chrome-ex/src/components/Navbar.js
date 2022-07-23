import React, {useState, useEffect, useRef} from 'react';
import {FaBars, FaTimes} from "react-icons/fa";
import "./NavBar.css"
import {useNavigate} from 'react-router-dom';


import Search from './Search'
import Dictionary from './Dictionary'





function Navbar(){

   // const history = useNavigate();
    

    const [page, setPage] = useState()
    const navRef = useRef();

    const showNavBar = () =>{
        navRef.current.classList.toggle("responsive_nav");
    }

  /*  const renderComponent = (page) =>{
        let currPage = null
        switch (page) {
        case 'home':
            page = <Search/>
            break
        case 'dictionary':
            page = <Dictionary />
            break
        }
        return currPage;
    }*/
    return(
        <header>
            <nav ref={navRef}>
                <a href="#" onClick={console.log('home')}>Home</a>
                <a href="#" onClick={console.log("click")}>My Dictionary</a>
                <button className ="nav-btn nav-close-btn"onClick={showNavBar}>
                    <FaTimes/>
                </button>
            </nav>
            <button className ="nav-btn"  onClick={showNavBar}>
            <FaBars/>
            </button>
        </header>
        )
}
export default Navbar;