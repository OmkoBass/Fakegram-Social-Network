import React, { useEffect, useState } from 'react'
// React Router
import { Link, useHistory, useLocation } from 'react-router-dom';
// Axios
import axios from 'axios';
// Ant Components
import { Avatar, Col, List, message, PageHeader, Row, Comment, Tooltip } from 'antd';

// Ant Icons
import { DeleteOutlined } from '@ant-design/icons';

import DATABASE from "../Utils";
import Ripple from "react-spinners-css/dist/Ripple";
import moment from "moment";

function Likes () {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const history = useHistory();

    const location = useLocation();

    const postID = location.pathname.split('/')[2];

    /*LIKED BY OR COMMENTED BY*/
    const type = location.pathname.split('/')[3];

    useEffect(() => {
        if (type === 'likedBy') {
            axios.get(`${ DATABASE }/profile/${ postID }/likedBy`).then(res => {
                if (res.data !== 401) {
                    setData(res.data);
                } else {
                    message.error('Something went wrong!');
                }
            }).then(() => setLoading(false));
        } else if (type === 'commentedBy') {
            axios.get(`${ DATABASE }/profile/${ postID }/commentedBy`)
                .then(res => {
                    if (res.data === 404) {
                        message.error("Doesn't exist!")
                        // Doesn't exist
                    } else if (res.data === 401) {
                        message.error("Something wrong happened!")
                        // Error
                    } else {
                        setData(res.data);
                    }
                }).then(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [postID, type]);

    const deleteComment = commentId => {
        axios.put(`${DATABASE}/post/comment/delete/${ commentId }`)
            .then(res => {
                if(res.data === 200) {
                    // Remove the comment from the state
                    setData(data.filter(comment => comment._id !== commentId));
                    message.success('Comment deleted!');
                } else {
                    // Error while deleting comment
                    message.error('Error while deleting comment!');
                }
            })
    }

    return <div>
        {
            loading
                ?
                <Ripple color='#1DA57A'
                        style={ {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        } }
                />
                :
                <div className='profile-edit'>
                    <PageHeader title={ type === 'likedBy' ? 'Liked by' : 'Commented' }
                                onBack={ () => history.goBack() }
                    />
                    <Row justify='center'>
                        {
                            type === 'likedBy'
                                ?
                                <Col>
                                    <List dataSource={ data } style={ { maxWidth: '618px' } }
                                          size='large'
                                          renderItem={ item => (
                                              <List.Item>
                                                  <Avatar src={ `https://fakegram-fs.s3.eu-central-1.amazonaws.com/${ item }` }
                                                          size={ 64 }
                                                          style={ { marginRight: '1em' } }
                                                  />
                                                  <Link to={ `/Profile/${ item }` }>@{ item }</Link>
                                              </List.Item>
                                          ) }
                                    />
                                </Col>
                                :
                                <Col xl={ 12 } lg={ 16 } md={ 18 } xs={ 22 }>
                                    <List
                                        itemLayout="vertical"
                                        dataSource={ data }
                                        renderItem={ item => (
                                            <List.Item>
                                                <Comment
                                                    author={item.commentedBy}
                                                    avatar={
                                                        <Avatar
                                                            src={ `https://fakegram-fs.s3.eu-central-1.amazonaws.com/${ item.commentedBy }` }
                                                            style={ { cursor: 'pointer' } }
                                                            onClick={ () => history.push(`/profile/${ item.commentedBy }`) }
                                                        />
                                                    }
                                                    actions={
                                                        item.commentedBy === localStorage.getItem('fakegram_username').replace(/"/g, '')
                                                        ?
                                                            [
                                                                <Tooltip key='delete' title='Delete'>
                                                            <span onClick={() => deleteComment(item._id)}>
                                                                <DeleteOutlined/>
                                                                Delete
                                                            </span>
                                                                </Tooltip>
                                                            ]
                                                        :
                                                        null
                                                    }
                                                    content={ item.comment }
                                                    datetime={ moment(item.date).format('DD.MM.YYYY HH:mm') }
                                                />
                                            </List.Item>
                                        ) }
                                    />
                                </Col>
                        }
                    </Row>
                </div>
        }
    </div>
}

export default Likes;
