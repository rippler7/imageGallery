function ImageDataGetter() {}
// Generic function to fetch images based on category and optional page
ImageDataGetter.fetchImages = function (category, page = '') {
  const url = `http://localhost:8888/images?category=${category}&page=${page}`;
  return fetch(url)
    .then(response => response.json())
    .then(result => result)
    .catch(error => {
      console.error(`Failed to fetch images for category '${category}' and page '${page}':`, error);
      return []; // Return empty array or handle error accordingly
    });
};

// Specific functions for fetching images without pagination
ImageDataGetter.getNatureImages = function () {
  return ImageDataGetter.fetchImages('nature');
};

ImageDataGetter.getArchitectureImages = function () {
  return ImageDataGetter.fetchImages('architecture');
};

ImageDataGetter.getFashionImages = function () {
  return ImageDataGetter.fetchImages('fashion');
};

// Specific functions for fetching images with pagination
ImageDataGetter.getNatureImagesFromPage = function (page) {
  return ImageDataGetter.fetchImages('nature', page);
};

ImageDataGetter.getArchitectureImagesFromPage = function (page) {
  return ImageDataGetter.fetchImages('architecture', page);
};

ImageDataGetter.getFashionImagesFromPage = function (page) {
  return ImageDataGetter.fetchImages('fashion', page);
};
