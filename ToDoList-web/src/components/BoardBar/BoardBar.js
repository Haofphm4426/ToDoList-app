import React, { useState } from 'react';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';
import { selectCurrentFullBoard } from 'redux/activeBoard/activeBoardSlice';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE, fieldErrorMessage } from 'utilities/validator';
import './BoardBar.scss';
import UserAvatar from 'components/Common/UserAvatar';
import UserSelectPopover from 'components/Common/UserSelectPopover';
import { USER_SELECT_POPOVER_TYPE_BOARD_MEMBERS } from 'utilities/constants';
import { inviteUserToBoardAPI } from 'actions/ApiCall';

import { socketIoInstance } from 'index';

function BoardBar() {
    const board = useSelector(selectCurrentFullBoard);
    const [showInvitePopup, setShowInvitePopup] = useState(false);
    const toggleShowInvitePopup = () => {
        setShowInvitePopup(!showInvitePopup);
    };
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmitInvitation = (data) => {
        //
        const { inviteeEmail } = data;
        const boardId = board._id;
        console.log('inviteeEmail: ', inviteeEmail);

        inviteUserToBoardAPI({ inviteeEmail, boardId }).then((invitation) => {
            console.log('invitation inviter: ', invitation);
            setValue('inviteeEmail', null);

            socketIoInstance.emit('c_user_invited_to_board', invitation);
        });
    };
    return (
        <nav className="navbar-board">
            <BootstrapContainer className="haofphm-trello-container">
                <Row>
                    <Col md={10} sm={12} className="col-no-padding">
                        <div className="board-info">
                            <div className="item board-logo-icon">
                                <i className="fa fa-coffee me-2" />
                                <strong>haofphm MERN Project</strong>
                            </div>
                            <div className="divider"></div>

                            <div className="item board-type">Private Workspace</div>
                            <div className="divider"></div>

                            <div className="item member__avatars">
                                {board?.users.map((user, index) => {
                                    if (index <= 2) {
                                        return (
                                            <div className="member__avatars__item" key={index}>
                                                <UserAvatar user={user} width="28px" height="28px" />
                                            </div>
                                        );
                                    }
                                })}
                                {board?.totalUsers - 3 > 0 && (
                                    <div className="member__avatars__item">
                                        <UserSelectPopover
                                            label={`+${board?.totalUsers - 3}`}
                                            users={board?.users}
                                            type={USER_SELECT_POPOVER_TYPE_BOARD_MEMBERS}
                                        />
                                    </div>
                                )}

                                <div className="member__avatars__item">
                                    <div className="invite">
                                        <div className="invite__label" onClick={toggleShowInvitePopup}>
                                            Invite
                                        </div>
                                        {showInvitePopup && (
                                            <div className="invite__popup">
                                                <span
                                                    className="invite__popup_close__btn"
                                                    onClick={toggleShowInvitePopup}
                                                >
                                                    <i className="fa fa-close" />
                                                </span>
                                                <div className="invite__popup__title mb-2">
                                                    Invite user to this board!
                                                </div>
                                                <div className="invite__popup__form">
                                                    <Form
                                                        className="common__form"
                                                        onSubmit={handleSubmit(onSubmitInvitation)}
                                                    >
                                                        <Form.Control
                                                            type="text"
                                                            className="invite__field mb-2"
                                                            placeholder="Enter email to invite..."
                                                            {...register('inviteeEmail', {
                                                                required: FIELD_REQUIRED_MESSAGE,
                                                                pattern: {
                                                                    value: EMAIL_RULE,
                                                                    message: EMAIL_RULE_MESSAGE,
                                                                },
                                                            })}
                                                        />
                                                        {fieldErrorMessage(errors, 'inviteeEmail')}
                                                        <Form.Group className="text-right">
                                                            <Button
                                                                variant="success"
                                                                type="submit"
                                                                size="sm"
                                                                className="px-4 mt-1"
                                                            >
                                                                Invite
                                                            </Button>
                                                        </Form.Group>
                                                    </Form>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {/* <Col md={2} sm={12} className="col-no-padding">
                        <div className="board-actions">
                            <div className="item menu">
                                <i className="fa fa-ellipsis-h me-2" />
                                Show menu
                            </div>
                        </div>
                    </Col> */}
                </Row>
            </BootstrapContainer>
        </nav>
    );
}

export default BoardBar;
