import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Redirect } from '@docusaurus/router';

export default function Logout() {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
    }, []);

    return <Redirect to="/login" />;
}
