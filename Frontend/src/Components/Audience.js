import React, { useEffect, useState } from 'react'
//React Router
import { Link, useHistory, useLocation } from 'react-router-dom';
//Axios
import axios from 'axios';
//Ant components
import { Avatar, Col, List, PageHeader, Row, Spin } from 'antd';

import DATABASE from "../Utils";

function Audience () {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const history = useHistory();

    const location = useLocation();

    const user = location.pathname.split('/')[2];

    const type = location.pathname.split('/')[3];

    useEffect(() => {
        if (type === 'following') {
            axios.get(`${ DATABASE }/users/username/${ user }`)
                .then(res => {
                    if (res !== null) {
                        setData(res.data.following);
                    }
                }).then(() => setLoading(false));
        } else {
            axios.get(`${ DATABASE }/users/username/${ user }`)
                .then(res => {
                    if (res !== null) {
                        setData(res.data.followers);
                    }
                }).then(() => setLoading(false));
        }
    }, [type, user]);

    return <div>
        {
            loading
                ?
                <Spin size='large'
                      style={ { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }/>
                :
                <div className='profile-edit'>
                    <PageHeader title={ type === 'following' ? 'Following' : 'Followers' }
                                onBack={ () => history.goBack() }
                    />
                    <Row justify='center'>
                        <Col>
                            <List dataSource={ data } style={ { maxWidth: '618px' } }
                                  size='large'
                                  renderItem={ item => (
                                      <List.Item>
                                          <Avatar src={ `https://fakegram-fs.s3.eu-central-1.amazonaws.com/${ item }` }
                                                  size={ 64 }
                                                  style={ { marginRight: '1em' } }/>
                                          <Link to={ `/Profile/${ item }` }>@{ item }</Link>
                                      </List.Item>
                                  ) }
                            />
                        </Col>
                    </Row>
                </div>
        }
    </div>
}

export default Audience;
