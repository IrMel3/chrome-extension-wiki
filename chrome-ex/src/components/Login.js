import React, {useEffect, useState,useContext} from 'react'
import axios from 'axios';
import { AuthContext } from './AuthContext';

function Login(){

    const [user, setUser] = useState(null);
    const [newUser, setNewUser] = useState(null);
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const checkIfUserExists = () =>{
        //check if user is in database 
        //if exists, add to localstorage
        
                let userData = {
                    user: user,
                }
                axios
                    .post("http://localhost:3000/loginUser", userData) //https://pwp.um.ifi.lmu.de/g20/loginUser
                    .then(res => {
                      console.log(res.data)
                      if(res.data.message === "User exists!"){
                      localStorage.setItem("User", user);
                      setIsAuth(true);
                      }
                    })
                    .catch(error => {console.log(error)
                    alert(error.message)}
                    )
      }
    
      const registerNewUser = () =>{
        //add new user to the database
        //set newUser to User
        let userData = {
          user: newUser,
      }
      axios
          .post("http://localhost:3000/registerUser", userData) //http://localhost:3000/  https://pwp.um.ifi.lmu.de/g20/registerUser
          .then(res => {
            console.log(res.data)
            if(res.data.message === "Saved new user!"){
            localStorage.setItem("User", newUser);
            alert("You successfully registered.")
            //sendlog
            }
          })
          .catch(error => {console.log(error)
            alert(error.message)
            //sendlog
          }
            )
    
      }


    return(
        <div><div><label>Please log in with your user name:</label>  
                  <input className="input"
                  id="userfield"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  /></div>
                  <button onClick={checkIfUserExists}>Login</button>
                  <div><label>Or register a new user name: </label>  
                  <input className="input"
                  id="userfield"
                  value={newUser}
                  onChange={e => setNewUser(e.target.value)}
                  /></div>
                  <button onClick={registerNewUser}>Register</button>
                  </div>
    )
}
export default Login;