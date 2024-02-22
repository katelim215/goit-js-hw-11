export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '42488056-39cd93b2543a722d8f6625aa2';

export const options = {
    params: {
        key: API_KEY,
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
    }
};