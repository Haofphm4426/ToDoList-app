import React from 'react';
import { Tooltip } from 'react-tooltip';

function UserAvatar({ user = {}, width = '30px', height = '30px', fontSize = '16px', tooltip }) {
    return (
        <>
            {user.avatar ? (
                <div data-tooltip-id="avatar-tooltip" data-tooltip-content={tooltip || user.displayName} className="user-avatar" >
                    <img src={user.avatar} style={{ width: width, height: height }} />
                </div>
            ) : (
                <div
                    data-tooltip-id="avatar-tooltip"
                    data-tooltip-content={tooltip || user.displayName}
                    className="default-avatar"
                    style={{ width: width, height: height, fontSize: fontSize }}
                >
                    <span className="first-username-char">{user?.displayName?.charAt(0) || 'A'}</span>
                </div>
            )}
            <Tooltip id="avatar-tooltip" />
        </>
    );
}

export default UserAvatar;
