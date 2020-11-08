import React, { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom';
//Ant components
import { Affix } from "antd";
//Ant icons
import { PlusCircleOutlined } from '@ant-design/icons';

import CreatePostModal from "./Smaller/CreatePostModal";
import '../Styles/ControlBar.css';

function ControlBar () {
    const location = useLocation();

    const [visible, setVisible] = useState(false);
    const [controlBarDisabled, setControlBarDisabled] = useState(false);

    useEffect(() => {
        if (location.pathname === '/profile') {
            setControlBarDisabled(true);
        } else {
            setControlBarDisabled(false);
        }
    }, [location]);

    return <Affix offsetBottom={ 0 }>
        <div
            className='control-bar'
            onClick={ () => setVisible(true) }
            style={ controlBarDisabled ? { display: 'none' } : { display: 'inherit' } }
        >
            <PlusCircleOutlined/>
        </div>

        <CreatePostModal
            callBack={ () => setVisible(false) }
            visible={ visible }
        />
    </Affix>
}

export default ControlBar;
