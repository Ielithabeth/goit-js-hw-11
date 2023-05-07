import axios from 'axios';

export async function fetchPhotos(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '28143013-44919de38ad9e5402793063fb';
  const options = `?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${BASE_URL}${options}`).then(response => response.data);
}