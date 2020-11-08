import React, { useEffect, useState } from 'react'

import axios from 'axios';

import { Row, Divider, Result } from "antd";

import Post from "./Smaller/Post";

import InfiniteScroll from "react-infinite-scroll-component";

import DATABASE from "../Utils";
import Error from "./Smaller/Error";
import Ripple from "react-spinners-css/dist/Ripple";

function Feed () {
    const [error, setError] = useState(false);
    const [feed, setFeed] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('fakegram_username')));

    const [totalPosts, setTotalPosts] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(true);

    const handleRemoveFromList = postId => {
        setFeed(feed.filter(post => post._id !== postId));
    }

    useEffect(() => {
        axios.get(`${ DATABASE }/feed/${ totalPosts }`).then(res => {
            if (res.data !== 401) {
                if (res.data.docs.length < 10) {
                    setHasMore(false);
                }

                setFeed(res.data.docs);
            } else {
                setError(true);
            }
        }).then(() => setLoading(false))
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get(`${ DATABASE }/feed/${ totalPosts }`).then(res => {
            if (res.data !== 401) {

                if (res.data.docs.length < 10) {
                    setHasMore(false);
                }

                setFeed([...feed, ...res.data.docs]);
            } else {
                setError(true);
            }
        }).then(() => setLoading(false));
    }, [totalPosts]);

    useEffect(() => {
        if (!localStorage.getItem('fakegram_username')) {
            axios.get(`${ DATABASE }/profile/username`).then(res => {
                if (res.data !== 401 && res.data !== 400) {
                    localStorage.setItem('fakegram_username', JSON.stringify(res.data));

                    setUser(res.data);
                } else {
                    setError(true);
                }
            });
        }
    }, []);

    return <div>
        <Row
            justify='center'
            style={ { padding: '1em' } }
        >
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
                    error
                        ?
                        <Error/>
                        :
                        <InfiniteScroll
                            next={ () => setTotalPosts(totalPosts + 10) }
                            hasMore={ hasMore }
                            loader={
                                <Ripple color='#1DA57A'
                                        style={ {
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        } }
                                />
                            }
                            dataLength={ feed.length }
                            endMessage={
                                <Result
                                    status='success'
                                    title='You have seen it all!'
                                    subTitle='You have seen all the posts from your audience. Check back later for more!'
                                />
                            }
                        >
                            {
                                feed.map((post, index) => <div key={index}>
                                        <Post
                                            removeFromList={ handleRemoveFromList }
                                            post={ post }
                                            user={ user }
                                            src={ `${ post.image }` }
                                            alt={ post.description }
                                        />

                                        <Divider/>
                                </div>)
                            }
                        </InfiniteScroll>
            }
        </Row>
    </div>
}

export default Feed;
