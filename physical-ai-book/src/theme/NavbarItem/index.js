import React from 'react';
import OriginalNavbarItem from '@theme-original/NavbarItem';
import UserBadge from '@site/src/components/UserBadge';
import LanguageToggle from '@site/src/components/LanguageToggle';

export default function NavbarItem(props) {
    if (props.type === 'custom-userBadge') {
        return <UserBadge {...props} />;
    }
    if (props.type === 'custom-languageToggle') {
        return <LanguageToggle {...props} />;
    }
    return <OriginalNavbarItem {...props} />;
}

