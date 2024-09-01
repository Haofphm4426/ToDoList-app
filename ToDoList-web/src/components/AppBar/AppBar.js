import React, { useEffect, useState } from 'react';
import './AppBar.scss';
import {
    Container as BootstrapContainer,
    Row,
    Col,
    InputGroup,
    FormControl,
    Form,
    Dropdown,
    Button,
    Badge,
} from 'react-bootstrap';
import haofphmLogo from 'resources/images/logo-haofphm-transparent-bg-192x192.png';
import UserAvatar from 'components/Common/UserAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, signOutUserAPI } from 'redux/user/userSlice';
import {
    addNotifications,
    fetchInvitationAPI,
    selectCurrentNotifications,
    updateBoardInvitationAPI,
} from 'redux/notification/notificationSlice';
import { Link, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { socketIoInstance } from 'index';

function AppBar() {
    const user = useSelector(selectCurrentUser);
    const notifications = useSelector(selectCurrentNotifications);
    console.log('notificaitons: ', notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newNoti, setNewNoti] = useState(false);

    useEffect(() => {
        dispatch(fetchInvitationAPI());

        socketIoInstance.on('s_user_invited_to_board', (invitation) => {
            console.log('invitation invitee: ', invitation);
            if (invitation.inviteeId === user._id) {
                dispatch(addNotifications(invitation));

                setNewNoti(true);
            }
        });
    }, [dispatch, user._id]);

    const updateBoardInvitation = (action, notification) => {
        dispatch(
            updateBoardInvitationAPI({
                action,
                notificationId: notification._id,
            })
        ).then((res) => {
            if (res.payload.boardInvitation.status === 'ACCEPTED') {
                navigate(`/b/${res.payload.boardInvitation.boardId}`);
            }
        });
    };
    return (
        <nav className="navbar-app">
            <BootstrapContainer className="haofphm-trello-container">
                <Row>
                    <Col md={5} sm={6} xs={12} className="col-no-padding">
                        <div className="app-actions">
                            {/* <div className="item all">
                                <i className="fa fa-th" />
                            </div>
                            <div className="item home">
                                <i className="fa fa-home" />
                            </div> */}
                            <div className="item boards">
                                <Link to={`/u/${user?.username}/boards`}>
                                    <i className="fa fa-columns" />
                                    &nbsp;&nbsp;<strong>Boards</strong>
                                </Link>
                            </div>
                            {/* <div className="item search">
                                <Form className="common__form">
                                    <InputGroup className="group-search">
                                        <FormControl className="input-search" placeholder="Jump to..." />
                                        <InputGroup.Text className="input-icon-search">
                                            <i className="fa fa-search" />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form>
                            </div> */}
                        </div>
                    </Col>
                    <Col md={2} sm={2} xs={12} className="col-no-padding">
                        <div className="app-branding text-center">
                            <a href="#top" target="blank">
                                <img src={haofphmLogo} className="top-logo" alt="trunguandev-logo" />
                                {/* <span className="haofphm-slogan">haofphm</span> */}
                            </a>
                        </div>
                    </Col>
                    <Col md={5} sm={4} xs={12} className="col-no-padding">
                        <div className="user-actions">
                            {/* <div className="item quick">
                                <i className="fa fa-plus-square-o" />
                            </div>
                            <div className="item news">
                                <i className="fa fa-info-circle" />
                            </div> */}
                            <div className="item notification">
                                <div className="common-dropdown">
                                    <Dropdown autoClose="outside">
                                        <div onClick={() => setNewNoti(false)}>
                                            <Dropdown.Toggle id="dropdown-basic" size="sm">
                                                <i className={`fa fa-bell icon ${newNoti ? 'ring' : ''}`} />
                                            </Dropdown.Toggle>
                                        </div>

                                        <Dropdown.Menu>
                                            <div className="notification__item__header">Notifications</div>

                                            <div className="notification__item__wrapper">
                                                {isEmpty(notifications) && (
                                                    <Dropdown.Item className="notification__item">
                                                        <div className="notification__item__content">
                                                            No notificaiton
                                                        </div>
                                                    </Dropdown.Item>
                                                )}
                                                {notifications?.map((noti, index) => {
                                                    if (noti.type == 'BOARD_INVITATION') {
                                                        return (
                                                            <Dropdown.Item className="notification__item" key={index}>
                                                                <div className="notification__item__content">
                                                                    <strong>{noti?.inviter?.displayName}</strong> had
                                                                    invited you to join the board:{' '}
                                                                    <strong>{noti?.board?.title}</strong>
                                                                </div>
                                                                {noti?.boardInvitation?.status === 'PENDING' && (
                                                                    <div className="notification__item__actions">
                                                                        <Button
                                                                            variant="success"
                                                                            type="button"
                                                                            size="sm"
                                                                            className="px-4"
                                                                            onClick={() => {
                                                                                updateBoardInvitation('accept', noti);
                                                                            }}
                                                                        >
                                                                            Accept
                                                                        </Button>
                                                                        <Button
                                                                            variant="secondary"
                                                                            type="button"
                                                                            size="sm"
                                                                            className="px-4"
                                                                            onClick={() => {
                                                                                updateBoardInvitation('reject', noti);
                                                                            }}
                                                                        >
                                                                            Reject
                                                                        </Button>
                                                                    </div>
                                                                )}

                                                                {noti?.boardInvitation?.status === 'ACCEPTED' && (
                                                                    <div className="notification__item__actions">
                                                                        <Badge bg="success">Accepted</Badge>
                                                                    </div>
                                                                )}
                                                                {noti?.boardInvitation?.status === 'REJECTED' && (
                                                                    <div className="notification__item__actions">
                                                                        <Badge bg="secondary">Rejected</Badge>
                                                                    </div>
                                                                )}
                                                            </Dropdown.Item>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="item user-avatar">
                                <div className="common-dropdown">
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic" size="sm">
                                            <UserAvatar user={user} tooltip={'day la avatar'} />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                as={Link}
                                                to={`/u/${user?.username}?tab=account`}
                                                className="account tqd-send"
                                            >
                                                <i className="icon fa fa-user" />
                                                Account
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to={`/u/${user?.username}?tab=settings`}
                                                className="settings tqd-send"
                                            >
                                                <i className="icon fa fa-cog" />
                                                Settings
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to={`/u/${user?.username}?tab=help`}
                                                className="help tqd-send"
                                            >
                                                <i className="icon fa fa-question-circle" />
                                                Help
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                className="sign-out tqd-send"
                                                onClick={() => dispatch(signOutUserAPI())}
                                            >
                                                <i className="icon danger fa fa-sign-out" />
                                                Sign out
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </BootstrapContainer>
        </nav>
    );
}

export default AppBar;
