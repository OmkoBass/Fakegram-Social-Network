import React, { useState } from 'react'

import axios from 'axios';
//Router
import { useHistory } from 'react-router-dom';
//Ant components
import { AutoComplete } from "antd";
//Lodash debounce
import { debounce } from 'lodash';

import DATABASE from "../../Utils";

function Search () {
    const [searchedUsers, setSearchedUsers] = useState(null);

    const history = useHistory();

    return <AutoComplete
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
            history.push(`/profile/${ value }`)
        } }
        className='header-search'
        size='medium'
        placeholder='Search for users'
    />
}

export default Search
