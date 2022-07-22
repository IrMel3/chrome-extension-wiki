import React, {useState, useEffect, useRef} from 'react';
import {FaBars, FaTimes} from "react-icons/fa";
import "./NavBar.css"

function Navbar(){
    const navRef = useRef();

    const showNavBar = () =>{
        navRef.current.classList.toggle("responsive_nav");
    }

    return(
        <header>
            <nav ref={navRef}>
                <a href="#">Home</a>
                <a href="#">My Dictionary</a>
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