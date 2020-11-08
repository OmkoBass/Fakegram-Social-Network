import React from 'react'
//Router
import { useHistory } from 'react-router-dom'
//ant components
import Result from "antd/es/result";
import Button from "antd/es/button";

function NotFound () {
    let history = useHistory();

    return <Result
        status='404'
        title='Oops!'
        subTitle="There's nothing here..."
        extra={
            <Button
                type='primary'
                onClick={ () => history.push('/') }
            >
                Go back
            </Button>
        }
    />
}

export default NotFound
