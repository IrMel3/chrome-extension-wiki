import React, {useEffect, useState,useContext} from 'react'
import axios from 'axios';
import "./Login.css"
import Alerts from './Alerts/Alerts'
import { AuthContext } from './AuthContext';
import { UserContext } from './UserContext';
import {Card, Button} from '@mui/material';

function Login(){

   // const [user, setUser] = useState(null);
    const {user, setUser} = useContext(UserContext);
    const [newUser, setNewUser] = useState(null);
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (type, title, message) =>{
      setAlertOpen(true);
      setAlertType(type);
      setAlertTitle(title);
      setAlertMessage(message)
    }

    const handleAlertClose = () => {
      setAlertOpen(false)
  }

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
                      //alert("You are now logged in.")
                      showAlert("info", "Info", "You are now logged in.");
                      sendLog("Successful login", user);
                      }
                      if(res.data.message === "User does not exist. Please register first."){
                        showAlert("warning", "Warning", "This User ID does not exist. Please register first.");
                        //alert("This User ID does not exist. Please register first.");
                      }
                    })
                    .catch(error => {
                      //alert(error.message)
                      showAlert("error", "Error", error.message);
                      console.log(error.message);
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
            //alert("You successfully registered.")
            showAlert("success", "Success", "You successfully registered");
            sendLog("Successful registration", newUser);
            }
            if(res.data.message === "User already exists! Choose another name."){
              //alert("This Name already exists - please chose another name or log in if you already created an ID.")
              showAlert("warning", "Warning", "This Name already exists - please chose another name or log in if you already created an ID.");
               
            }
          })
          .catch(error => {console.log(error)
            //alert(error.message)
            showAlert("error", "Error", error.message);
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
         <Alerts className="alert" type={alertType} message={alertMessage} title={alertTitle} isOpen={alertOpen} handleClose={handleAlertClose}></Alerts>
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