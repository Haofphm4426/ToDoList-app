import { createSlice } from '@reduxjs/toolkit';

//Khởi tạo giá trị một Slice trong redux
const initialState = {
    currentActiveCard: null,
};

// Khởi tạo một slice trong redux store
export const activeCardSlice = createSlice({
    name: 'activeCard',
    initialState,
    reducers: {
        // Lưu ý luôn là ở đây cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
        // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
        clearCurrentActiveCard: (state) => {
            state.currentActiveCard = null;
        },
        updateCurrentActiveCard: (state, action) => {
            const incomingCard = action.payload;
            const reverseComments = Array.isArray(incomingCard.comments) ? [...incomingCard.comments].reverse() : [];
            state.currentActiveCard = { ...incomingCard, comments: reverseComments };
        },
    },
    extraReducers: (builder) => {
        //
    },
});

// Action creators are generated for each case reducer function
// Actions: dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions;

// Selectors: mục đích là dành cho các components bên dưới gọi bằng useSelector() tới nó để lấy dữ liệu từ trong redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
    return state.activeCard.currentActiveCard;
};

export default activeCardSlice.reducer;
