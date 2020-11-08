import React, { useEffect, useState } from 'react'

import axios from 'axios';
//Router
import { Redirect, useHistory, useLocation } from "react-router-dom";
//ant components
import { Avatar, Button, Col, Divider, message, Row, Typography } from "antd";
//ant icons
import { SettingOutlined } from '@ant-design/icons';
//Components
import SettingsModal from "./Smaller/SettingsModal";
import EditProfilePictureModal from "./Smaller/EditProfilePictureModal";
import DoesntExist from "./Smaller/DoesntExist";
import Post from "./Smaller/Post";
import DATABASE from "../Utils";
import '../Styles/Profile.css';
import Ripple from "react-spinners-css/dist/Ripple";
import Error from "./Smaller/Error";

function Profile () {
    let history = useHistory();

    const location = useLocation();

    /*I split the URL path, it should be /profile/username
    If the "username" part is empty i know it's MY profile
    If it's not empty i will fetch the posts and user profile
    Of the other person*/
    const isUser = location.pathname.split('/')[2];

    const [profilePictureSrc, setProfilePictureSrc] = useState(null);

    const [profile, setProfile] = useState(null);
    const [profilePosts, setProfilePosts] = useState([]);

    const [searchedUser, setSearchedUser] = useState(null);
    const [searchedUserPosts, setSearchedUserPosts] = useState([]);

    const [profileLoading, setProfileLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    const [error, setError] = useState(false);

    const [settingsModal, setSettingsModal] = useState(false);

    const [profilePictureModal, setProfilePictureModal] = useState(false);

    async function getSearchedUser () {
        return await axios.get(`${ DATABASE }/users/username/${ isUser }`)
    }

    async function getSearchedUserPosts () {
        return await axios.get(`${ DATABASE }/posts/${ isUser }`);
    }

    async function getProfile () {
        return await axios.get(`${ DATABASE }/profile`);
    }

    async function getProfilePosts () {
        return await axios.get(`${ DATABASE }/profile/posts`);
    }

    const messageFail = content => {
        message.error(content);
    }

    const setProfiles = async () => {
        const searched = await getSearchedUser().catch(() => {
            setError(true);
            setProfileLoading(false);
        });
        const profile = await getProfile().catch(() => {
            setError(true);
            setProfileLoading(false);
        });

        if(searched) {
            if (searched.data !== 400 && searched.data !== 401 && profile.data !== 400 && profile.data !== 401) {
                setProfile(profile.data);

                if (searched.data !== null) {
                    setSearchedUser(searched.data);

                    if (isUser) {
                        setProfilePictureSrc(searched.data.profilePicture);
                    }
                } else {
                    setProfilePictureSrc(profile.data.profilePicture);
                }
            } else {
                messageFail('Getting profiles failed! Please reload!');
            }
        }
    }

    const setPosts = async () => {
        // GETS THE SEARCHED USERS POST
        if (isUser) {
            const searchedUserPosts = await getSearchedUserPosts().catch(() => {
               setError(true);
               setPostsLoading(false);
            });

            if (searchedUserPosts) {
                if (searchedUserPosts.data !== 400 && searchedUserPosts.data !== 400) {
                    setSearchedUserPosts(searchedUserPosts.data);
                } else {
                    messageFail('Getting posts failed! Please reload!');
                }
            }
        } else {
            // GETS OUR POSTS
            const profilePosts = await getProfilePosts().catch(() => {
               setError(true);
               setPostsLoading(false);
            });

            if (profilePosts) {
                if (profilePosts.data !== 400 && profilePosts.data !== 401) {
                    setProfilePosts(profilePosts.data);
                } else {
                    messageFail('Getting posts failed! Please reload!');
                }
            }
        }
    }

    /*USEEFFECT FOR GETTING PROFILES*/
    useEffect(() => {
        setProfiles().then(() => setProfileLoading(false));
    }, [isUser]);

    /*USEEFFECT FOR GETTING POSTS*/
    useEffect(() => {
        setPosts().then(() => setPostsLoading(false));
    }, [isUser]);

    const handleRemoveFromList = postId => {
        setProfilePosts(profilePosts.filter(post => post._id !== postId));
    }

    // This could probably be split up, fuck it, I decided to do it like this

    function handleProfileComponent () {
        if (error) {
            return <Error />
        } else if (profileLoading) {
            return <Ripple color='#1DA57A'
                           style={ {
                               position: 'absolute',
                               top: '50%',
                               left: '50%',
                               transform: 'translate(-50%, -50%)'
                           } }
            />
        } else if (isUser) {
            // To stop the DoesntExist from showing up for a split second put it at the bottom
            if (!searchedUser) {
                return <DoesntExist/>
            } else if (isUser === profile.username) {
                return <Redirect to='/profile'/>
            } else {
                // SEARCHED USER
                return <div>
                    <Row justify='center' style={{padding: '0.6em'}}>
                        <div className='profile-picture'>
                            <Col md={ 8 } xs={ 24 }>
                                <Avatar src={ `${ profilePictureSrc }` }
                                        size={ 192 }/>
                            </Col>
                        </div>

                        <Col md={ 16 } xs={ 24 }>
                            <div className='profile-about'>
                                <h1> </h1>

                                <div>
                                    <Typography.Title level={ 4 }>Username</Typography.Title>
                                    <Typography.Text
                                        strong>{ searchedUser.username }</Typography.Text>
                                </div>

                                <h1> </h1>

                                <div>
                                    <Typography.Title level={ 4 }>Posts</Typography.Title>
                                    <Typography.Text
                                        strong>{ searchedUser.posts.length }
                                    </Typography.Text>
                                </div>

                                <div className='audience'
                                     onClick={ () => history.push(`/profile/${ searchedUser.username }/followers`) }>
                                    <Typography.Title level={ 4 }>Followers</Typography.Title>
                                    <Typography.Text
                                        strong>{ searchedUser.followers.length }
                                    </Typography.Text>
                                </div>

                                <div className='audience'
                                     onClick={ () => history.push(`/profile/${ searchedUser.username }/following`) }>
                                    <Typography.Title level={ 4 }>Following</Typography.Title>
                                    <Typography.Text
                                        strong>{ searchedUser.following.length }
                                    </Typography.Text>
                                </div>

                                <div>
                                    <Button type='default'
                                        onClick={() => history.push(`/messages/${searchedUser.username}`)}
                                    >Message</Button>
                                </div>

                                <div>
                                    <Button
                                        type={ profile.following.includes(searchedUser.username) ? 'default' : 'primary' }
                                        onClick={ () => {
                                            profile.following.includes(searchedUser.username)
                                                ?
                                                axios.put(`${ DATABASE }/unfollow/${ searchedUser.username }`, {}).then(() => {
                                                    setSearchedUser({
                                                        ...searchedUser,
                                                        followers: searchedUser.followers.filter(user => user !== profile.username)
                                                    });

                                                    setProfile({
                                                        ...profile,
                                                        following: profile.following.filter(user => user !== searchedUser.username)
                                                    });
                                                })
                                                :
                                                axios.put(`${ DATABASE }/follow/${ searchedUser.username }`, {}).then(() => {
                                                    setSearchedUser({
                                                        ...searchedUser,
                                                        followers: [...searchedUser.followers, profile.username]
                                                    });

                                                    setProfile({
                                                        ...profile,
                                                        following: [...profile.following, searchedUser.username]
                                                    });
                                                });
                                        } }
                                    >{ profile.following.includes(searchedUser.username) ? 'Following' : 'Follow' }</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row justify='center'>
                        <Col>
                            <div style={ { textAlign: 'center' } }>
                                <Typography.Title level={ 4 }>Bio</Typography.Title>
                                <Typography.Text strong>{ searchedUser.bio }</Typography.Text>
                            </div>
                        </Col>
                    </Row>
                </div>
            }
        } else {
            // YOUR PROFILE
            return <div>
                <Row className='profile-header'>
                    <div className='profile-picture'>
                        <Col md={ 8 } xs={ 24 }>
                            <Avatar onClick={ () => setProfilePictureModal(true) } size={ 192 }
                                    src={ `${ profilePictureSrc }` }
                                    style={{ cursor: 'pointer' }}
                            />
                        </Col>
                    </div>

                    <SettingsModal callBack={ () => setSettingsModal(false) } visible={ settingsModal }/>
                    <EditProfilePictureModal callBack={ () => setProfilePictureModal(false) }
                                             visible={ profilePictureModal }
                                             returnProfilePicture={ src => {
                                                 setProfilePictureSrc(`https://fakegram-fs.s3.eu-central-1.amazonaws.com/${src}`);
                                             } }
                    />

                    <Col md={ 16 } xs={ 24 }>
                        <div className='profile-about'>
                            <div>
                                <Typography.Title level={ 4 }>Username</Typography.Title>
                                <Typography.Text
                                    strong>{ profile.username }</Typography.Text>
                            </div>

                            <Button
                                type='default'
                                onClick={ () => {
                                    history.push('/profile/edit');
                                } }
                            >
                                Edit Profile
                            </Button>

                            <SettingOutlined onClick={ () => setSettingsModal(true) }/>

                            <div>
                                <Typography.Title level={ 4 }>Posts</Typography.Title>
                                <Typography.Text
                                    strong>{ profile.posts.length }
                                </Typography.Text>
                            </div>

                            <div className='audience'
                                 onClick={ () => history.push(`/profile/${ profile.username }/followers`) }>
                                <Typography.Title level={ 4 }>Followers</Typography.Title>
                                <Typography.Text
                                    strong>{ profile.followers.length }
                                </Typography.Text>
                            </div>

                            <div className='audience'
                                 onClick={ () => history.push(`/profile/${ profile.username }/following`) }>
                                <Typography.Title level={ 4 }>Following</Typography.Title>
                                <Typography.Text
                                    strong>{ profile.following.length }
                                </Typography.Text>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row justify='center'>
                    <Col>
                        <div style={ { textAlign: 'center' } }>
                            <Typography.Title level={ 4 }>Bio</Typography.Title>
                            <Typography.Text strong>{ profile.bio }</Typography.Text>
                        </div>
                    </Col>
                </Row>
            </div>
        }
    }

    function handlePostComponent () {
        if (error) {
            return null;
        } else if (postsLoading || profileLoading) {
            return <Ripple color='#1DA57A'
                           style={ {
                               position: 'absolute',
                               top: '80%',
                               left: '50%',
                               transform: 'translate(-50%, -50%)'
                           } }
            />
        } else {
            if (isUser) {
                if (!searchedUser) {
                    return null
                }
                if (searchedUserPosts) {
                    return <div className='profile-posts'>
                        <Divider> <Typography.Title level={ 4 }>Posts</Typography.Title> </Divider>

                        {
                            searchedUserPosts.length === 0
                            ?
                                <Row style={{ display: 'block', margin: 'auto' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                        <Typography.Title type='secondary'>
                                            You have not posted anything yet!
                                        </Typography.Title>
                                        <Typography.Text type='secondary'>
                                            Make a post for everyone to see!
                                        </Typography.Text>
                                    </div>
                                </Row>
                            :
                                <Row>
                                    {
                                        searchedUserPosts.map((post, index) => <Col md={ 7 } xs={ 22 }
                                                                                    key={ index }
                                                                                    style={ { margin: '1em' } }
                                        >
                                            <Post post={ post }
                                                  user={ profile.username }
                                                  src={ `${ post.image }` }
                                                  alt={ post.description }
                                            />
                                        </Col>)
                                    }
                                </Row>
                        }
                    </div>
                }
            } else {
                return <div className='profile-posts' style={ { overflowX: 'hidden' } }>
                    <Divider> <Typography.Title level={ 4 }>Posts</Typography.Title> </Divider>

                    <Row style={ { padding: '1em' } }
                         gutter={ [{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }] }>
                        {
                            profilePosts.length === 0 ?
                                <Row style={{ display: 'block', margin: 'auto' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                        <Typography.Title type='secondary'>
                                            You have not posted anything yet!
                                        </Typography.Title>
                                        <Typography.Text type='secondary'>
                                            Make a post for everyone to see!
                                        </Typography.Text>
                                    </div>
                                </Row>
                                :
                                profilePosts.map((post, index) => <Col md={ 8 } xs={ 24 }
                                                                       key={ index }
                                >
                                    <Post
                                        removeFromList={ handleRemoveFromList }
                                        post={ post }
                                        user={ profile.username }
                                        src={ `${ post.image }` }
                                        alt={ post.description }
                                    />
                                </Col>)
                        }
                    </Row>
                </div>
            }
        }
    }

    function handleAppropriateProfile () {
        return <div className='profile'>
            { handleProfileComponent() }

            { handlePostComponent() }
        </div>
    }

    return handleAppropriateProfile();
}

export default Profile
