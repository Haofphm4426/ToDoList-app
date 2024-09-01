import React from 'react';

import './Card.scss';
import { useDispatch } from 'react-redux';
import { updateCurrentActiveCard } from 'redux/activeCard/activeCardSlice';
import { isEmpty } from 'lodash';
import UserAvatar from 'components/Common/UserAvatar';

function Card({ card }) {
    const dispatch = useDispatch();
    const setActiveCard = () => {
        dispatch(updateCurrentActiveCard(card));
    };
    return (
        <div className="card-item" onClick={setActiveCard}>
            {card.cover && (
                <img
                    src={card.cover}
                    className="card-cover"
                    alt="haofphm-alt-img"
                    onMouseDown={(e) => e.preventDefault()}
                />
            )}
            <div className="card-item__base-content">
                <div className="title">{card.title}</div>
                <div className="general-info">
                    {!isEmpty(card?.c_cardMembers) &&
                        <div className="users-count">
                            <i className="fa fa-user me-2" />
                            {card?.c_cardMembers?.length}
                        </div>
                    }
                    {card?.comments?.length > 0 &&
                        <div className="comments-count">
                            <i className="fa fa-comments me-2" />
                            {card?.comments?.length}
                        </div>
                    }
                </div>
                {!isEmpty(card?.c_cardMembers) &&
                <div className="member__avatars">
                    {card?.c_cardMembers.map((u, index) => (
                        <div className="member__avatars__item" key={index}>
                            <UserAvatar
                                user={u}
                                width="28px"
                                height="28px"
                            />
                        </div>
                    ))}
                </div>
                }
            </div>
        </div>
    );
}

export default React.memo(Card);
