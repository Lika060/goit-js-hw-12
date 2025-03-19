
import axios from 'axios';

const API_KEY = '49342840-003e2c292237fbf09de0074d9';
const BASE_URL = 'https://pixabay.com/api/';

export async function getPictures(query, page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 15,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch images');
  }
}