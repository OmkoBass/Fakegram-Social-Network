import React from 'react'

import { useHistory } from 'react-router-dom';

import { Button, Result, Typography } from 'antd';

function Error () {
    const history = useHistory();

    return <Result
        title='Something went wrong!'
        status='error'
        subTitle={<Typography>
            <Typography.Paragraph>
                <Typography.Text type='secondary'>
                    Check your internet connection and try again.
                    <br/>
                    Check back soon if it still doesn't work.
                </Typography.Text>
            </Typography.Paragraph>
        </Typography>}
        extra={
            <Button
                type='primary'
                danger
                onClick={ () => history.push('/') }
            >
                Home
            </Button>
        }
    >
    </Result>
}

export default Error;
