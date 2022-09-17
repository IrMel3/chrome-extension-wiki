import React, {useEffect, useState,useContext} from 'react'
import axios from 'axios';
import "./Login.css"
import { AuthContext } from './AuthContext';
import {Card, Button} from '@mui/material';

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
                      alert("You are now logged in.")
                      sendLog("Successful login", user);
                      }
                    })
                    .catch(error => {
                    console.log(error);
                    alert(JSON.toString(error.message));
                    sendLog("Failed Login", userData);}
                    
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
            sendLog("Successful registration", newUser);
            }
          })
          .catch(error => {console.log(error)
            alert(error.message)
            sendLog("Error in registration" + error.message, userData);
          }
            )
    
      }

      const sendLog = (action, user) =>{
        let timestamp = new Date();
            let loggingData = {
                user: user,
                timestamp: timestamp,
                action: action,
            }
            axios
                .post("http://localhost:3000/addLog", loggingData)
                .then(data => console.log(data))
                .catch(error => console.log(error))
        
    }


    return(
      <Card  className="loginContainer" style={{backgroundColor: "#d4e6f1", borderRadius: "15px"}} >
        <div><div><label className="loginText">Please log in with your user name:</label>  
                  <input className="input"
                  id="userfield"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  /></div>
                  {/*<Button variant="text" onClick={checkIfUserExists} className="loginBtn">Login</Button>*/}
                  <button onClick={checkIfUserExists} className="loginBtn">Login</button>
                  <div><hr className="loginSeperator"></hr></div>
                  <div><label className="registerText">Or register a new user name: </label>  
                  <input className="input"
                  id="userfield"
                  value={newUser}
                  onChange={e => setNewUser(e.target.value)}
                  /></div>

                  {/*<Button variant="text" onClick={registerNewUser} className="registerBtn">Register</Button>*/}
                  <button onClick={registerNewUser} className="registerBtn">Register</button>
                  </div>
                  </Card>
    )
}
export default Login;