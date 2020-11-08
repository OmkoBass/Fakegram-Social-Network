import React, { useContext, useEffect, useState } from 'react'
//Router
import { Redirect, useHistory } from "react-router";
//ant icons
import { LockOutlined, UserOutlined } from '@ant-design/icons';
//ant
import Divider from "antd/es/divider";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";
import message from "antd/es/message";
//Context
import { AuthContext } from "./Auth";
import axios from "axios";
import DATABASE from "../Utils";

import '../Styles/Login.css';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import fakegram from '../Assets/Fakegram.png'

function Login () {
    let history = useHistory();

    //Number of login tries
    const [loggedIn, setLoggedIn] = useState(0);
    const [loading, setLoading] = useState(false);

    const { currentUser, setCurrentUser } = useContext(AuthContext);

    useEffect(() => {
        if (loggedIn !== 0)
            message.error('Check your username or password!');
    }, [loggedIn]);

    const handleOnFinish = value => {
        sendLoginInfo(value)
    }

    if (currentUser)
        return <Redirect to='/'/>

    const sendLoginInfo = value => {
        setLoading(true);

        axios.post(`${ DATABASE }/login/user`, {
            username: value.username.toLowerCase(),
            password: value.password
        })
            .then(res => {
                if (res.data === 401 || res.data === 400) {
                    message.error('Check your username or password!');
                    setLoading(false);
                } else if (res.data === 403) {
                    message.error('Please verify your email first!');
                    setLoading(false);
                } else {
                    setLoading(false);
                    setCurrentUser(res.data);

                    setLoggedIn(0);

                    history.push('/');
                }
            }).catch(() => {
                setLoading(false);
                message.error('Check your internet connection!');
        });
    }

    return <div className='login'>
        <div className='login-form'>
            <LazyLoadImage
                style={{width: '100%'}}
                src={fakegram}
                alt={fakegram}
                effect={'blur'}
            />

            <Divider/>

            <Form onFinish={ handleOnFinish }>
                <Form.Item
                    name='username'
                    rules={ [
                        {
                            required: true,
                            message: 'Enter your username!'
                        }
                    ] }
                >
                    <Input
                        prefix={ <UserOutlined/> }
                        size='large'
                        className='login-form-input'
                        placeholder='Username'
                    />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={ [
                        {
                            required: true,
                            message: 'Enter your password!',
                        }]
                    }>
                    <Input.Password
                        prefix={ <LockOutlined/> }
                        size='large'
                        className='login-form-input'
                        placeholder='Password'
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        loading={loading}
                        type='primary'
                        block={ true }
                        htmlType='submit'
                    >
                        Log In
                    </Button>
                </Form.Item>

                <Divider style={ { color: 'lightGray' } }> OR </Divider>

                <Form.Item>
                    <Button
                        type='default'
                        block={ true }
                        onClick={ () => history.push('/signup') }
                    >
                        Create an account!
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
}

export default Login
