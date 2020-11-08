import React from 'react';
//Router
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
//Ant design css
import 'antd/dist/antd.css';
//Context
import { AuthProvider } from "./Components/Auth";
//Less
import 'antd/dist/antd.less';
//Css
import './Styles/Global.css';

// Components
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import VerifyEmail from "./Components/VerifyEmail";
import ProfileCreated from "./Components/ProfileCreated";
import NotFound from "./Components/NotFound";

function App () {
    return <AuthProvider>
        <Router>
            <Switch>
                <Route path='/verify/:userId/:verificationId' component={ VerifyEmail }/>
                <Route path='/login' component={ Login }/>
                <Route path='/signup' component={ Signup }/>
                <Route path='/profile-created' component={ ProfileCreated }/>
                <Route path='/404' component={ NotFound }/>
                <Route path='' component={ Home }/>
                <Redirect to='/404'/>
            </Switch>
        </Router>
    </AuthProvider>
}

export default App;
