import React, { useState, useContext } from 'react'
//axios
import axios from 'axios';
//Router
import { useHistory } from "react-router";
//ant icons
import { LockOutlined, UserOutlined } from '@ant-design/icons';
//ant design
import { Button, Divider, Form, Input, message, Radio } from "antd";
//Context
import { AuthContext } from "./Auth";
import DATABASE from "../Utils";

import '../Styles/Login.css';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import fakegram from '../Assets/Fakegram.png'

function Signup () {
    const [sending, setSending] = useState(false);

    let history = useHistory();

    //Form ref
    let [form] = Form.useForm();

    const { currentUser } = useContext(AuthContext);

    if (currentUser)
        history.push('/');

    const handleOnFinish = value => {
        setSending(true);
        axios.post(`${ DATABASE }/user-create`, {
            email: value.email,
            username: value.username,
            password: value.password,
            sex: value.sex
        }).then(res => {
            if (res.data === 404) {
                fail();
                setSending(false);
            } else if (res.data === 400) {
                alreadyExists();
                setSending(false);
            } else if (res.data === 200) {
                history.push('/profile-created');
            }
        })
    }

    const fail = () => {
        message.error('Something went wrong!');
    }

    const alreadyExists = () => {
        message.error('Username or email are already taken!');
    }

    const handleValidatePassword = (rule, value) => {
        if (value.length < 8) {
            return Promise.reject('Must be at least 8 characters!');
        }
        return Promise.resolve();
    }

    const handleValidateConfirmPassword = (rule, value) => {
        if (value === form.getFieldValue('password')) {
            return Promise.resolve();
        }
        return Promise.reject('Passwords are not the same!');
    }

    const handleValidateUsername = (rule, value) => {
        if (value.includes('/') || value.includes('\\')) {
            return Promise.reject('Cannot have illegal characters!');
        }
        return Promise.resolve();
    }

    const genderLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
    };

    return <div className='login'>
        <div className='login-form'>
            <LazyLoadImage
                style={{width: '100%'}}
                src={fakegram}
                alt={fakegram}
                effect={'blur'}
            />

            <Divider/>

            <Form
                form={ form }
                onFinish={ handleOnFinish }
            >
                <Form.Item
                    name='email'
                    rules={ [
                        {
                            required: true,
                            type: 'email',
                            message: 'Please enter a valid email!'
                        }
                    ] }
                >
                    <Input
                        size='large'
                        className='login-form-input'
                        placeholder='Email'
                    />
                </Form.Item>

                <Form.Item
                    name='username'
                    rules={ [
                        {
                            required: true,
                            message: 'Please enter your username!'
                        },
                        {
                            validator: handleValidateUsername,
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
                            validator: handleValidatePassword,
                            required: true,
                        }]
                    }>
                    <Input.Password
                        prefix={ <LockOutlined/> }
                        size='large'
                        className='login-form-input'
                        placeholder='Password'
                    />
                </Form.Item>

                <Form.Item
                    name='passwordConfirm'
                    rules={ [
                        {
                            validator: handleValidateConfirmPassword,
                            required: true,
                        }]
                    }>
                    <Input.Password
                        prefix={ <LockOutlined/> }
                        size='large'
                        className='login-form-input'
                        placeholder='Confirm password'
                    />
                </Form.Item>

                <Form.Item { ...genderLayout }
                           name='sex'
                           label='Gender'
                           rules={ [
                               {
                                   required: true,
                                   message: 'Please enter your gender'
                               }]
                           }
                >
                    <Radio.Group>
                        <Radio value={ true }>Male</Radio>
                        <Radio value={ false }>Female</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button
                        loading={sending}
                        htmlType='submit'
                        type='primary'
                        block={ true }
                    >
                        Sign Up
                    </Button>
                </Form.Item>

                <Divider style={ { color: 'lightGray' } }> OR </Divider>

                <Form.Item>
                    <Button
                        type='default'
                        block={ true }
                        onClick={ () => history.push('/login') }
                    >
                        Log In!
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
}

export default Signup
