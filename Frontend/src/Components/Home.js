import React, { useContext } from 'react'

import axios from 'axios';
//Router
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
//Context
import { AuthContext } from "./Auth";
import '../Styles/Home.css';
//Components
import HEADER from "./HEADER";
import ControlBar from "./ControlBar";
import Chat from "./Chat";
import Messages from "./Messages";
import Explore from "./Explore";
import Likes from "./Likes";
import Audience from "./Audience";
import ProfileEdit from "./ProfileEdit";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Feed from "./Feed";

function Home () {
    const { currentUser } = useContext(AuthContext);

    const { path } = useRouteMatch();

    axios.defaults.headers.get['token'] = currentUser;
    axios.defaults.headers.put['token'] = currentUser;
    axios.defaults.headers.post['token'] = currentUser;

    if (!currentUser) {
        return <Redirect to='/login'/>
    }

    return <div className='home'>
        <HEADER/>
        <div style={ { minHeight: '88vh' } }>
            <Switch>
                <Route path='/messages/:username' component={ Chat } />
                <Route path='/messages' component={ Messages }/>

                <Route path='/explore' component={ Explore }/>

                <Route path='/profile/:postId/commentedBy' component={ Likes }/>
                <Route path='/profile/:postId/likedBy' component={ Likes }/>
                <Route path='/profile/:username/followers' component={ Audience }/>
                <Route path='/profile/:username/following' component={ Audience }/>
                <Route path='/profile/edit' component={ ProfileEdit }/>
                <Route path='/profile/:username' component={ Profile }/>
                <Route path='/profile' component={ Profile }/>
                <Route path='/notifications' component={ Notifications }/>

                <Route path={''} component={ Feed }/>
            </Switch>
        </div>

        <ControlBar/>
    </div>
}

export default Home
