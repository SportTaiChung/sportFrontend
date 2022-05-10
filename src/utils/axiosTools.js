import { forIn } from 'lodash';

export function getFormData(obj) {
  const form = new FormData();

  forIn(obj, (val, key) => {
    form.append(key, val);
  });

  return form;
}

export function objToUrlQuery(obj) {
  return `?${new URLSearchParams(obj).toString()}`;
}
