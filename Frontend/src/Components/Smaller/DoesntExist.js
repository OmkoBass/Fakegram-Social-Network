import React from 'react'

import { useHistory } from 'react-router-dom';

import { Button, Result } from 'antd';

function DoesntExist () {
    const history = useHistory();

    return <Result
        title='Nothing here!'
        status='error'
        subTitle="The user doesn't exist or you don't have an internet connection."
        extra={
            <Button
                type='primary'
                danger
                onClick={ () => history.push('/') }
            >
                Feed
            </Button>
        }
    >
    </Result>
}

export default DoesntExist;
