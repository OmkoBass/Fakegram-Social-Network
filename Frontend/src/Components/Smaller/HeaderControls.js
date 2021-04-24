import React, { useEffect, useState } from 'react'
//Router
import { useHistory, useLocation } from 'react-router-dom'
//Ant icons
import { HeartOutlined, HomeOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
//Ant Components
import Col from "antd/es/col";
import Row from "antd/es/row";

function HeaderControls ({ mobile }) {
    let location = useLocation();
    let history = useHistory();

    const [controls, setControls] = useState(0);

    useEffect(() => {
        if (location.pathname === '/') {
            setControls(0);
        } else if (location.pathname === '/messages') {
            setControls(1);
        } else if (location.pathname === '/notifications') {
            setControls(2);
        } else if (location.pathname.includes('/profile')) {
            setControls(3);
        }

    }, [location]);


    return <Row className='header-controls' justify='space-between'
        gutter={[12, 48]}
    >
        <Col span={mobile ? 24 : null} style={{ textAlign: 'center' }}>
            <HomeOutlined
                onClick={ () => history.push('/') }
                className={ controls === 0 ? 'header-selected' : null }
            />
        </Col>

        <Col span={mobile ? 24 : null} style={{ textAlign: 'center' }}>
            <SendOutlined
                onClick={ () => history.push('/messages') }
                className={ controls === 1 ? 'header-selected' : null }
            />
        </Col>

        <Col span={mobile ? 24 : null} style={{ textAlign: 'center' }}>
            <HeartOutlined
                onClick={() => history.push('/notifications')}
                className={ controls === 2 ? 'header-selected' : null }
            />
        </Col>

        <Col span={mobile ? 24 : null} style={{ textAlign: 'center' }}>
            <UserOutlined
                onClick={ () => history.push('/profile') }
                className={ controls === 3 ? 'header-selected' : null }
            />
        </Col>
    </Row>
}

export default HeaderControls
