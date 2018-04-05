import { ajax } from '../utils';

const url = '/api/meetupEnrollment';
export const submit = (data) => ajax.postData(url, data);
export const update = (data) => ajax.updateData(url, data);
