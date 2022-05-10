import { Message } from 'element-ui';
export const success = function (message) {
  Message({
    type: 'success',
    message: message,
  });
};

export const info = function (message) {
  Message({
    type: 'info',
    message: message,
  });
};

export const warn = function (message) {
  Message({
    type: 'warning',
    message: message,
  });
};

export const error = function (message) {
  Message({
    type: 'error',
    message: message,
  });
};

export const showApiErrorMessage = function (res) {
  if (res?.message) {
    Message({
      type: 'error',
      message: res.message,
    });
  }
};
