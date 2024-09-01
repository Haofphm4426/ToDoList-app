let apiRoot = ''
if (process.env.REACT_APP_BUILD_MODE === 'dev') {
    apiRoot = 'http://localhost:8017'
}

if (process.env.REACT_APP_BUILD_MODE === 'production') {
    apiRoot = 'https://todolist-api-21z1.onrender.com'
}
console.log('env: ', process.env.REACT_APP_BUILD_MODE);
console.log('apiRoot: ', apiRoot)
export const API_ROOT = apiRoot;
// export const API_ROOT = 'https://trello-haofphm-api.herokuapp.com'

export const MODAL_ACTION_CLOSE = 'MODAL_ACTION_CLOSE';
export const MODAL_ACTION_CONFIRM = 'MODAL_ACTION_CONFIRM';

export const USER_SELECT_POPOVER_TYPE_BOARD_MEMBERS = 'USER_SELECT_POPOVER_TYPE_BOARD_MEMBERS';
export const USER_SELECT_POPOVER_TYPE_CARD_MEMBERS = 'USER_SELECT_POPOVER_TYPE_CARD_MEMBERS';
