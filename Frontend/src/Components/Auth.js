import React, { useEffect, useState } from 'react';

export const AuthContext = React.createContext(undefined, undefined);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('User')));

    useEffect(() => {
        localStorage.setItem('User', JSON.stringify(currentUser));

        setCurrentUser(currentUser);
    }, [currentUser]);

    return <AuthContext.Provider value={ { currentUser, setCurrentUser } }>
        { children }
    </AuthContext.Provider>
}
