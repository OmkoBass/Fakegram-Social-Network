import React, { useContext } from 'react'

import { useHistory } from 'react-router-dom';
//Ant components
import { Button, Modal } from "antd";
//Context
import { AuthContext } from "../Auth";

function SettingsModal (props) {
    const history = useHistory();

    const { setCurrentUser } = useContext(AuthContext);

    const signOut = () => {
        localStorage.removeItem('User');
        localStorage.removeItem('fakegram_username');

        history.push('/login');

        setCurrentUser(null);
    }

    return <Modal
        title='Options'
        visible={ props.visible }
        onCancel={ () => props.callBack() }
        footer={ false }
        mask={ false }
    >
        <Button
            onClick={ signOut }
            type='primary'
            block={ true }
        >
            Logout!
        </Button>
    </Modal>
}

export default SettingsModal;
