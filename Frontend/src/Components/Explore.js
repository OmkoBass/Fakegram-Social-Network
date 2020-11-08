import React from 'react'
//ant components
import Result from "antd/es/result";

import soon from "../Assets/Soon.png";

function Explore () {
    return <Result
        status='info'
        title='Soon...'
        subTitle="Under construction, check back in some time."
    >
        <img
            className='soon'
            src={ soon }
            alt='soon'/>
    </Result>
}

export default Explore
