import React from 'react'
//Router
import { useHistory } from "react-router-dom";
//Ant components
import { Button, Col, Result, Row, Typography } from "antd";

import success from '../Assets/ProfileCreated.png'

function ProfileCreated () {
    let history = useHistory();

    return <Result
        status='success'
        title={<Typography.Title level={1}>Success! <br/> Check your JUNK folder </Typography.Title>}
        subTitle='Verify your email and then log in to your new fakegram profile!'
        extra={ [
            <Row gutter={ 48 } key={ 1 }>
                <Col span={ 24 }>
                    <img src={ success } alt='success'
                         style={ { width: '100%', maxWidth: '812px' } }
                    />
                </Col>

                <Col span={ 24 }>
                    <Button type='primary'
                            size='large'
                            style={ { marginTop: '2em' } }
                            onClick={ () => history.push('/login') }
                    >
                        Log in!
                    </Button>
                </Col>
            </Row>
        ] }
    />
}

export default ProfileCreated;
