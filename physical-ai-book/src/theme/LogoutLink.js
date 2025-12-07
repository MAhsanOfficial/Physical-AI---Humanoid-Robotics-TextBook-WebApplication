import React, { useContext } from 'react';
import { AuthContext } from '@site/src/contexts/AuthContext';
import Link from '@docusaurus/Link';

export default function LogoutLink() {
  const { logout } = useContext(AuthContext);
  return (
    <Link to="#" onClick={(e) => { e.preventDefault(); logout(); }}>
      Logout
    </Link>
  );
}
