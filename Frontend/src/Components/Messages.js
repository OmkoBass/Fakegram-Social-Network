import React, { useEffect, useState } from 'react'

// React router
import { Link, useHistory } from "react-router-dom";

//Ant Components
import { Row, Col, PageHeader, AutoComplete, Typography, Divider, List, Avatar } from "antd";
import { debounce } from "lodash";
import axios from "axios";
import DATABASE from "../Utils";

function Messages () {
    const [following, setFollowing] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState(null);

    const history = useHistory();

    useEffect(() => {
        axios.get(`${DATABASE}/profile/following`)
            .then(res => {
               if(res.data === 400) {
                   // Error
               } else {
                   setFollowing(res.data);
               }
            });
    }, []);

    return <div>
        <PageHeader title={ 'Messages' }
                    onBack={ () => history.goBack() }
        />

        <Row justify='center' style={{padding: '1em'}}>
            <Col span={24} style={{ textAlign: 'center' }}>
                <Typography.Title level={3}>
                    Enter a username and send them a message!
                </Typography.Title>
            </Col>

            <Col lg={8} md={12} xs={22}>
                <AutoComplete
                    style={{width: '100%'}}
                    options={ searchedUsers ? searchedUsers : null }
                    onChange={ debounce(value => {
                        if (value) {
                            axios.get(`${ DATABASE }/users/search/${ value }`)
                                .then(res => {
                                    if (res.data !== 401) {
                                        setSearchedUsers(res.data.map(user => {
                                            return { value: `${ user }` }
                                        }));
                                    }
                                });
                        }
                    }, 500) }
                    onSelect={ value => {
                        history.push(`/messages/${ value }`)
                    } }
                    size='large'
                    placeholder='Send a message to...'
                />
            </Col>
            <Divider />

            <Row justify='center'>
                <Col>
                    <List dataSource={ following } style={ { maxWidth: '618px' } }
                          size='large'
                          renderItem={ item => (
                              <List.Item>
                                  <Avatar src={ `https://fakegram-fs.s3.eu-central-1.amazonaws.com/${ item }` }
                                          size={ 64 }/>
                                  <Link to={ `/messages/${ item }` }>@{ item }</Link>
                              </List.Item>
                          ) }
                    />
                </Col>
            </Row>
        </Row>
    </div>
}

export default Messages
