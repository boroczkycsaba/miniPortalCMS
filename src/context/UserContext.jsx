import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged,signInWithEmailAndPassword,signOut,
createUserWithEmailAndPassword, 
updateProfile,
sendSignInLinkToEmail,
sendPasswordResetEmail} from 'firebase/auth';
import { auth } from '../utility/fireBaseApp.js';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [msg,setMsg]=useState(null)
  const navigate=useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const logoutUser=async ()=>{
    await signOut(auth) 
    localStorage.removeItem("miniPortalUserCompany");
    localStorage.removeItem("miniPortalLoggedIn");
    if(location.pathname.startsWith('/portal/'))
          navigate('/')   

  }
  const loginUser=async (email,password)=>{
    try{
       await signInWithEmailAndPassword(auth,email,password)
       setMsg({...msg,signin:null}) 
       localStorage.setItem("miniPortalLoggedIn", "yes");         
       navigate('/portal/dashboard');
      }catch(err){
        console.log(err.message)
        setMsg({...msg,signin:err.message})
    }
  }

  const sendEmailLink=async (email)=>{
    try{
        await sendSignInLinkToEmail(auth,email,{
          url:"http://localhost:4000/login",
          handleCodeInApp:true
        })
        alert('We have sent you an email with a link to sign in.')
        logoutUser()
    }catch(err){
      console.log(err.message);
      setMsg({...msg,signup:err.message})
    }
  }

  const signUpUser=async (email,password,displayName)=>{
    try{
      await createUserWithEmailAndPassword(auth,email,password)
      await updateProfile(auth.currentUser,{displayName})
      sendEmailLink(email)
      setMsg({...msg,signup:null})
     
   }catch(err){
       console.log(err.message)
       setMsg({...msg,signup:err.message})
   }
  }

  const resetPassword=async (email)=>{
    try{
      await sendPasswordResetEmail(auth,email)
      alert('jelszómódosítási link elküldve....');
      navigate('/signin')
    }catch(err){
      console.log(err.message);
      setMsg({...msg, resetpw: err.message})
    }
  }

    return (
    <UserContext.Provider value={{ user,logoutUser,loginUser,signUpUser, resetPassword,msg}}>
      {children}
    </UserContext.Provider>
  );
};
