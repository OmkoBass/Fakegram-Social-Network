import React, { useState, useEffect } from 'react'
import axios from "axios";

// React router
import { useHistory } from "react-router-dom";

// Ant Components
import { Row, Col, PageHeader, message, List } from "antd";

// Components
import Notification from "./Smaller/Notification";
import Error from "./Smaller/Error";

// Loading component
import Ripple from "react-spinners-css/dist/Ripple";

import DATABASE from "../Utils";


function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const history = useHistory();

    useEffect(() => {
        axios.get(`${DATABASE}/user/notifications`).then(res => {
            if(res.data !== 400) {
                setNotifications(res.data);
                setLoading(false);
            } else {
                // Error getting notifications
                message.error('Error getting notifications!');
            }
        }).catch(_ => setError(true));
    }, []);

    const handleReturnAppropriateComponent = _ => {
        if (error) {
            return <Error />
        } else if (loading) {
            return <Ripple color='#1DA57A'
                           style={ {
                               position: 'absolute',
                               top: '50%',
                               left: '50%',
                               transform: 'translate(-50%, -50%)'
                           } }
            />
        } else {
            return <div>
                <PageHeader title={ 'Notifications' }
                            onBack={ () => history.goBack() }
                />

                <Row justify='center'>
                    <Col>
                        <List dataSource={ notifications } style={ { maxWidth: '618px' } }
                              size='large'
                              renderItem={ item => (
                                  <List.Item>
                                      <Notification
                                          key={item._id}
                                          who={item.who}
                                          action={item.action}
                                          what={item.what}
                                      />
                                  </List.Item>
                              ) }
                        />
                    </Col>
                </Row>
            </div>
        }
    }

    return <div>
        {handleReturnAppropriateComponent()}
    </div>
}

export default Notifications;
