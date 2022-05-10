import { showApiErrorMessage } from '@/utils/messageHandler';

// 此函數封裝常見res statue判斷,並且當錯誤時會有element UI message提示
export const autoAPI = function (callFunc, val, isShowApiErrorByMessage = true) {
  return new Promise((resolve, reject) => {
    callFunc(val)
      .then((res) => {
        if (res.code === 200) {
          resolve(res);
        } else {
          if (isShowApiErrorByMessage) {
            showApiErrorMessage(res);
          }
          reject(res);
        }
      })
      .catch(reject);
  });
};
