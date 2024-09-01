import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_ROOT } from 'utilities/constants';
import authorizedAxiosInstance from 'utilities/customAxios';

//Khởi tạo giá trị một Slice trong redux
const initialState = {
    currentNotifications: null,
};

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk

export const fetchInvitationAPI = createAsyncThunk('notifications/fetchInvitationAPI', async () => {
    const request = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`);
    return request.data;
});

export const updateBoardInvitationAPI = createAsyncThunk(
    'notifications/updateBoardInvitation',
    async ({ action, notificationId }) => {
        const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/${notificationId}`, {
            action,
        });
        return request.data;
    }
);

// Khởi tạo một slice trong redux store
export const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearCurrentNotifications: (state) => {
            state.currentNotifications = null;
        },

        updateCurrentNotification: (state, action) => {
            state.currentNotifications = action.payload;
        },
        addNotifications: (state, action) => {
            const incomingInvitation = action.payload;

            state.currentNotifications.unshift(incomingInvitation);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInvitationAPI.fulfilled, (state, action) => {
            let incomingInvitations = action.payload;
            state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : [];
        });
        builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
            console.log('action: ', action);
            const incomingInvitations = action.payload;
            const getInvitation = state.currentNotifications.find((i) => i._id === incomingInvitations._id);
            getInvitation.boardInvitation = incomingInvitations.boardInvitation;
        });
    },
});

// Action creators are generated for each case reducer function
// Actions: dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentNotifications, updateCurrentNotification, addNotifications } = notificationSlice.actions;

// Selectors: mục đích là dành cho các components bên dưới gọi bằng useSelector() tới nó để lấy dữ liệu từ trong redux store ra sử dụng
export const selectCurrentNotifications = (state) => {
    return state.notifications.currentNotifications;
};

// Export default cái activeBoardReducer của chúng ta
const notificationsReducer = notificationSlice.reducer;
export default notificationsReducer;
