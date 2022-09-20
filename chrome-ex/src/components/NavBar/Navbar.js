import React, {useRef} from 'react';
import {FaBars, FaTimes} from "react-icons/fa";
import "./NavBar.css"

import Search from './Search/Search'
import Dictionary from './Dictionary/Dictionary'



function Navbar(){

    const navRef = useRef();

    const showNavBar = () =>{
        navRef.current.classList.toggle("responsive_nav");
    }

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