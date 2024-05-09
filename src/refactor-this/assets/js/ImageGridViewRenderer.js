function ImageGridViewRenderer() { }

ImageGridViewRenderer.prototype.render = function () {
  /// Define the navbar HTML using template literals
  const navLinks = `
  <div class="navbar-nav">
    <a class="nav-link" href="?category=nature">Nature</a>
    <a class="nav-link" href="?category=architecture">Architecture</a>
    <a class="nav-link" href="?category=fashion">Fashion</a>
  </div>
`;

  const navHTML = `
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow p-3">
    <div class="flex w-full"><h1><a class="navbar-brand" href="index.html"><h1>Photo Sharing App</h1></a></div>
    <div class="w-1/3 content-between" id="navbarNavAltMarkup">
      ${navLinks}
    </div>
  </nav>
`;

  // Insert the navbar HTML into the "main-view" element
  const mainView = document.getElementById("main-view");
  mainView.innerHTML = navHTML;

  // Add click event listeners to all nav-link elements
  const navbarNav = mainView.querySelector('.navbar-nav');
  const navLinksList = navbarNav.querySelectorAll('.nav-link');

  navLinksList.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior

      // Remove 'active' class from all nav-links
      navLinksList.forEach(navLink => {
        navLink.classList.remove('active');
      });

      // Add 'active' class to the clicked nav-link
      link.classList.add('active');

      // Optionally, handle navigation logic here (e.g., fetching images based on href)
      const href = link.getAttribute('href');
      this.renderImagesContainer(href);
    });
  });
  // this section should initialize and set the category and page 
  let page = 1;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let category = urlParams.get('category');
  if (!category) {
    category = "nature";
  }
  if (urlParams.has('page')) {
    page = Number(urlParams.get('page'));
  }
  if (category) {
    this.renderImagesContainer(category, page);
  }

};

ImageGridViewRenderer.prototype.renderImagesContainer = function (category, page) {
  //so this takes the category and page from the browser addressbar and we have to set a consistent format as well
  if (!window.location.search) {
    window.location.search = `?category=${category}&page=${page}`;
  }
  // this is the loading animation spinner section
  document.getElementById("main-view").innerHTML += `<div id="loading-animation" style="display: none;" class="w-full text-center align-middle h-screen p-10 size-7">
    <div class="spinner-border w-full text-center align-middle flex-wrap h-screen size-10 p-5" role="status">
      <div class="sr-only text-center align-middle">Loading...</div>
    </div>
  </div>`
  //set the spinner loading anim as visible while images aren't loaded in yet
  document.getElementById('loading-animation').style.display = 'block';

  //populate the image grid
  document.getElementById("main-view").innerHTML +=
    '<div class="container mx-auto">'
    + `<div id="${category}-images" class="grid grid-cols-3"></div>`
    + '</div>'

  //do a for loop 3 times for every 3 output on every pass and then fetch the images dynamically
  for (let item = 2; item >= 0; item--) {
    if (category) {
      console.log(category);
      ImageDataGetter.getCatImagesFromPage(category, (page * 3) - item)
        .then(function (images) {
          document.getElementById('loading-animation').style.display = 'none';
          for (const element of images) {
            document.getElementById(`${category}-images`).innerHTML +=
              '<div class="col" style="height: 400px; padding: 10px;">'
              + '  <img class="image" src="' + element.url + '" alt="' + element.name + '" style="height: 100%; object-fit: cover; width: 100%;" />'
              + '  <div class="middle">'
              + '    <a class="btn btn-dark" href="' + element.url + '" download="' + element.name + '">DOWNLOAD</a>'
              + '  </div>'
              + '</div>'
          }
        });
    }
  }
  let prevsearchstr = window.location.search.split('&page')[0] + '&page=' + (page - 1);
  let nextsearchstr = window.location.search.split('&page')[0] + '&page=' + (page + 1);
  let pagination =
    '<nav class="w-full content-center grid grid-cols-2 fixed inset-x-0 bottom-0 z-10 pt-5">'
    + '    <div class="page-item text-center w-0.75"><a class="page-link" href="' + prevsearchstr + '">Previous</a></div>'
    + '    <div class="page-item text-center w-0.75"><a class="page-link" href="' + nextsearchstr + '">Next</a></div>'
    + '</nav>'

  document.getElementById("main-view").innerHTML += pagination;
}

