import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import React, {useState} from 'react'
import Home from "../components/home/Home.jsx";
import Header from "../components/header/Header.jsx";
import Login from "../components/login/Login.jsx";
import Signup from "../components/signup/Signup.jsx";
import AskQuestion from "../components/questions/AskQuestion.jsx";
import Questions from "../components/questions/Questions.jsx";
import Content from "../components/questions/Content.jsx";
import Profile from "../components/profile/home/Home.jsx";
import MyQuestions from "../components/profile/myQuestions/MyQuestions.jsx";
import UpdateQuestion from "../components/profile/myQuestions/UpdateQuestion.jsx";
import MyAnswers from "../components/profile/myAnswers/myAnswers.jsx";
import UpdateAnswer from "../components/profile/myAnswers/UpdateAnswer.jsx";
import Admin from "../components/admin/home/Admin.jsx";
import User from "../components/admin/user/Users.jsx";
import UserAnswers from "../components/admin/userAnswers/UserAnswers.jsx";
import UserQuestions from "../components/admin/userQuestions/UserQuestions.jsx";
import Tags from "../components/tags/Tags.jsx";




const PrivateRoute=({isAuthenticated})=>{
    //show this only when the user is logged in.
    return isAuthenticated?
    <> 
        <Outlet/>
    </>
    :<Navigate replace to='/login'/>
    //when the user is not signed in, navigate to login page, or when there is a refresh take it back to login page
  }

const Routers = () =>{
    const[isAuthenticated, isUserAuthenticated]=useState(false);
    return(
        <div>
            <Header isUserAuthenticated={isUserAuthenticated} 
        isAuthenticated={isAuthenticated}/>
            <Routes>               
                <Route path='/' element={<Home/>}/>
                <Route path='/login' element={<Login isUserAuthenticated={isUserAuthenticated}/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/addquestion' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path="/addquestion" element={<AskQuestion />} />
                </Route>
                <Route path='/questions' element={<Questions/>}/>
                <Route path='/question/:id' element={<Content/>}/>
                <Route path = '/questionOntags/:type' element = {<Tags/>}/>

                {/* profile routes */}
                <Route path='/profile' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path='/myquestions' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path="/myquestions" element={<MyQuestions />} />
                </Route>
                <Route path='/updateque/:id' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path='/updateque/:id' element = {<UpdateQuestion/>}/>
                </Route>
                <Route path='/myanswers' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path='/myanswers' element={<MyAnswers />}/>
                </Route>
                <Route path='/updateanswer/:id' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path='/updateanswer/:id' element= {<UpdateAnswer/>}/>
                </Route>
                
                {/* admin routes  */}
                <Route path='/adminhome' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path='/adminhome' element={<Admin/>}></Route>
                </Route>
                <Route path='/users' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path='/users' element={<User />}></Route>
                </Route>
                <Route path='/allQuestions' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path='/allQuestions' element={<UserQuestions/>}></Route>
                </Route>
                <Route path='/allAnswers' element={<PrivateRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path='/allAnswers' element={<UserAnswers/>}></Route>
                </Route>
                
                
                
                

            </Routes>
        </div>
    )
}

export default Routers;