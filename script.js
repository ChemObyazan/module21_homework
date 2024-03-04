//поиск селекторов
document.querySelector('.fetchButton').addEventListener('click', function() {
  const pageNumberInput = document.querySelector('.input-pageNumber').value;
  const limitInput = document.querySelector('.input-limit').value;
  const imageContainer = document.querySelector('.imageContainer');
  const errorMessage = document.querySelector('.errorMessage');
  
  imageContainer.innerHTML = '';
  errorMessage.innerHTML = '';

//проверка валидности значений полей
  const pageNumber = parseInt(pageNumberInput);
  const limit = parseInt(limitInput);
  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 10 || isNaN(limit) || limit < 1 || limit > 10) {
    errorMessage.innerHTML = 'Номер страницы и/или лимит вне диапазона от 1 до 10';
    return;
  }

//выполнение запроса к серверу
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetchImages(pageNumber, limit, options)
    .then(data => {
      data.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.download_url;
        imgElement.classList.add('imageContainer__image');
        imageContainer.appendChild(imgElement);
      });
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      errorMessage.innerHTML = 'Произошла ошибка при выполнении запроса';
    });
});

//проверка данных localStorage
async function fetchImages(pageNumber, limit, options) {
  const savedImages = localStorage.getItem('images');
  if (savedImages) {
    const imagesData = JSON.parse(savedImages);
    return imagesData;
  }

//если данных нет, то делаю запрос в localStorage
  const url = `https://picsum.photos/v2/list?page=${pageNumber}&limit=${limit}`;
  const response = await fetch(url, options);
  const data = await response.json();

  localStorage.setItem('images', JSON.stringify(data));

  return data;
}
