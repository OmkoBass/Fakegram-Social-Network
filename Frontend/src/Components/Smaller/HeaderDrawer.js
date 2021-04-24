import React from 'react'

import Drawer from 'antd/es/drawer';

import HeaderControls from "./HeaderControls";

function HeaderDrawer ({ visible, close }) {
    return <Drawer
        visible={ visible }
        onClose={ close }
        closeIcon={ false }
        placement='bottom'
    >
        <div onClick={ close }>
            <HeaderControls mobile={true}/>
        </div>
    </Drawer>
}

export default HeaderDrawer;
