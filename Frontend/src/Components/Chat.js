import React, { useState, useEffect } from 'react'

import axios from "axios";

// React router
import { useLocation, useHistory } from "react-router-dom";

// Ant Components
import { Row, Col, Form, Input, List, Skeleton, PageHeader, Button, message } from "antd"

// Ant Icons
import { SendOutlined } from '@ant-design/icons';


// Components
import Error from "./Smaller/Error";

import DATABASE from "../Utils";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [sending, setSending] = useState(false);
    const [sendingError, setSendingError] = useState(false);

    const history = useHistory();
    const location = useLocation();

    let [form] = Form.useForm();

    // Gets the username from URL
    const who = location.pathname.split('/')[2];

    useEffect(() => {
        if(who === JSON.parse(localStorage.getItem('fakegram_username'))) {
            history.push('/profile')
        }
    }, []);

    useEffect(() => {
        axios.get(`${DATABASE}/messages/${who}`)
            .then(res => {
                if(res.data === 400) {
                    setError(true);
                } else {
                    setLoading(false);
                    setMessages(res.data);
                }
            }).catch(() => setError(true));

    }, []);

    useEffect(() => {
        if (sendingError) {
            message.error('An error occurred while sending the message!');
            setSendingError(false);
        }
    }, [sendingError]);

    const onFinish = values => {
        setSending(true);
        axios.post(`${DATABASE}/messages/${who}`, {content: values.content})
            .then(res => {
                if(res.data === 400) {
                    setSendingError(true);
                } else {
                    setSending(false);
                    setMessages([...messages, {
                        receiver: res.data.receiver,
                        content: res.data.content,
                        sender: res.data.sender,
                        date: res.data.date}
                        ]
                    );
                    form.resetFields();
                }
            }).catch(() => {
                setSending(false);
                setSendingError(true);
        });
    }

    const handleReturnAppropriateComponent = () => {
        if (error) {
            return <Error />
        } else {
            return <div>
                <PageHeader title={ `You're chatting with: ${who}` }
                            onBack={ () => history.goBack() }
                />
                <Row justify='center'>
                    <Col lg={12} md={14} xs={22}>
                        <List
                            style={{ overflowY: 'scroll', height: '75vh'}}
                            itemLayout='vertical'
                            size='small'
                            bordered
                            dataSource={messages}
                            renderItem={item => <List.Item
                                style={item.receiver === who ? {backgroundColor: '#1DA57A', color: 'white'} : null}
                                key={item._id}
                            >
                                <Skeleton
                                    active
                                    loading={loading}
                                >
                                    <div style={item.receiver !== who ? {textAlign: 'left'} : {textAlign: 'right'}}>
                                        {item.content}
                                    </div>
                                </Skeleton>
                            </List.Item>}
                        />
                        <Form onFinish={onFinish}
                              form={ form }
                        >
                            <Form.Item
                                name='content'
                                rules={ [
                                    {
                                        required: true,
                                        message: 'Type something!'
                                    }
                                ] }
                            >
                                <Input
                                    addonAfter={<Button
                                        loading={sending}
                                        htmlType='submit'
                                        icon={<SendOutlined />}
                                    />}
                                    size='large'
                                   placeholder='Send a message'
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        }
    }

    return <div>
        {handleReturnAppropriateComponent()}
    </div>
}

export default Chat;
