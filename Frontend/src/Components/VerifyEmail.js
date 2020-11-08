import React, { useEffect, useState } from 'react'

import axios from 'axios';

// React router
import { useParams, useHistory } from "react-router-dom";

import { Row, Col, Typography, Button } from "antd";
import DATABASE from "../Utils";

function VerifyEmail() {
    const history = useHistory();

    const [verified, setVerified] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        axios.get(`${DATABASE}/verify/${userId}/${verificationId}`)
            .then(res => {
                console.log(res.data);
                if(res.data === 200) {
                    setVerified(true);
                } else if(res.data === 404) {
                    setNotFound(true);
                } else {
                    setVerified(false);
                }
            })
    }, []);

    const { userId, verificationId } = useParams();

    return <Row
        justify='center'
        align='middle'
        style={{backgroundColor: '#147355', height: '100vh'}}>
        <Col
            md={12}
            xs={22}
            style={{ textAlign: 'center', backgroundColor: '#178461', padding: '1em', borderRadius: '8px'}}>
            <Typography.Title style={{ color: 'white' }}>
                {
                    notFound
                    ?
                        'Bad link!'
                    :
                    verified === null
                    ?
                        'Waiting for verification'
                    :
                    verified === true
                    ?
                    <div>
                        <Typography.Title level={1}
                                          style={{color: 'white'}}
                        >
                            Your email has been verified!
                        </Typography.Title>

                        <Button
                            type='primary'
                            size='large'
                            onClick={() => history.push('/')}>
                            Home
                        </Button>
                    </div>
                    :
                    'Something went wrong!'
                }
            </Typography.Title>
        </Col>
    </Row>
}

export default VerifyEmail;
