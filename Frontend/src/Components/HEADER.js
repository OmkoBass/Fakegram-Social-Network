import React, { useState } from 'react'
// React Router
import { useHistory } from "react-router-dom";
// Ant Components
import Layout from 'antd/es/layout'
//Components
import Search from "./Smaller/Search";
import HeaderControls from "./Smaller/HeaderControls";
import Affix from "antd/es/affix";
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Grid from 'antd/es/grid';

import { MenuOutlined } from '@ant-design/icons';

import HeaderDrawer from "./Smaller/HeaderDrawer";

import '../Styles/Header.css';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import fakegram from '../Assets/Fakegram.png'

const { useBreakpoint } = Grid;

const { Header } = Layout;

function HEADER () {
    const [visible, setVisible] = useState(false);

    const history = useHistory();
    const screens = useBreakpoint();

    return <Affix>
        <Header className='header'>
            <Row justify='space-between'>
                <Col lg={3} xs={6}>
                    <LazyLoadImage
                        onClick={() => history.push('/')}
                        style={{width: '100%', cursor: 'pointer'}}
                        src={fakegram}
                        alt={fakegram}
                        effect={'blur'}
                    />
                </Col>

                <Col lg={6} md={8} sm={10} xs={14}>
                    <Search/>
                </Col>

                {
                    !screens.md
                        ?
                        <Col>
                            <MenuOutlined
                                className='delete-icon icon-hover'
                                style={ { fontSize: '2em', transform: 'translate(1.4em, 0.15em)' } }
                                onClick={ () => setVisible(true) }
                            />
                        </Col>
                        :
                        <Col span={ 4 }>
                            <HeaderControls/>
                        </Col>
                }
            </Row>
        </Header>
        <HeaderDrawer visible={ visible } close={ () => setVisible(false) }/>
    </Affix>
}

export default HEADER
