import axios from 'axios';
import { toast } from 'react-toastify';
import { refreshTokenAPI } from 'actions/ApiCall';
import { signOutUserAPI } from 'redux/user/userSlice';

let store;
export const injectStore = (_store) => {
    store = _store;
};

let authorizedAxiosInstance = axios.create();
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10; // 10 minutes;
authorizedAxiosInstance.defaults.withCredentials = true; // Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE

const updateSendingApiStatus = (sending = true) => {
    const submits = document.querySelectorAll('.tqd-send');

    for (let i = 1; i < submits.length; i++) {
        if (sending) submits[i].classList.add('.tqn-waiting');
        else submits[i].classList.remove('.tqn-waiting');
    }
};

authorizedAxiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        updateSendingApiStatus(true);
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

let refreshTokenPromise = null;

// Can thiệp vào giữa response trả về
authorizedAxiosInstance.interceptors.response.use(
    function (response) {
        // Bất kỳ mã status code nằm trong phạm vi 200 - 299 thì sẽ là success và code chạy vào đây
        // Do something with response data
        updateSendingApiStatus(false);
        return response;
    },
    function (error) {
        // Bất kỳ mã status code nằm ngoài phạm vi 200 - 299 thì sẽ bị coi là error và code chạy vào đây
        // Do something with response error'
        updateSendingApiStatus(false);

        if (error.response?.status === 401) {
            store.dispatch(signOutUserAPI(false));
        }

        const originalRequests = error.config;
        if ((error.response?.status === 410) && !originalRequests._retry) {
            // originalRequests._retry = true có tác dụng khi gửi lại yêu cầu nếu vẫn bị lỗi 410 thì nó sẽ dừng lại tránh gây vòng lặp vô hạn
            originalRequests._retry = true;
            console.log('originalRequests: ', originalRequests)

            // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token vào cho cái refreshTokenPromise này
            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshTokenAPI()
                    .then((data) => {
                        return data?.accessToken;
                    })
                    .catch(() => {
                        store.dispatch(signOutUserAPI(false));
                    })
                    .finally(() => {
                        refreshTokenPromise = null;
                    });
            }
            return refreshTokenPromise.then((accessToken) => {
                // Hiện tại ở đây không cần dùng gì tới accessToken vì chúng ta đã đưa nó vào cookie (xử lý từ phía BE) khi api được gọi thành công.
                // Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết code ở đây.

                // Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để call lại những api ban đầu bị lỗi
                return authorizedAxiosInstance(originalRequests);
            });
        }

        let errorMessage = error?.message;
        if (error.response?.data?.errors) {
            errorMessage = error.response?.data?.errors;
        }
        // if (error.response?.status !== 410)
        console.log('errorMessage: ', errorMessage)
        toast.error(errorMessage);

        return Promise.reject(error);
    }
);

export default authorizedAxiosInstance;
