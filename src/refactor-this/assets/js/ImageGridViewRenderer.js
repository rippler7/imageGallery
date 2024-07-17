function ImageGridViewRenderer() { }

ImageGridViewRenderer.prototype.render = function () {
  // Define the navbar HTML using template literals
  const navLinks = `
    <div class="navbar-nav w-full">
      <a class="nav-link text-gray-800 hover:text-cyan-700" href="?category=nature">Nature</a>
      <a class="nav-link text-gray-800 hover:text-cyan-700" href="?category=architecture">Architecture</a>
      <a class="nav-link text-gray-800 hover:text-cyan-700" href="?category=fashion">Fashion</a>
    </div>
  `;

  const navHTML = `
    <nav class="navbar fixed w-full navbar-expand-lg bg-white shadow p-3 top-0 content-center z-10">
      <div class="flex w-full"><h1 class="text-lg"><a class="navbar-brand text-gray-800 hover:text-cyan-700" href="index.html">Photo Sharing App</h1></a></div>
      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 content-stretch flex flex-wrap text-center justify-between" id="navbarNavAltMarkup">
        ${navLinks}
      </div>
    </nav>
  `;

  // Insert the navbar HTML into the "main-view" element
  const mainView = document.getElementById("main-view");
  mainView.innerHTML += navHTML;

  // Add click event listeners to all nav-link elements
  const navbarNav = mainView.querySelector('.navbar-nav');
  const navLinksList = Array.from(navbarNav.querySelectorAll('.nav-link'));

  navLinksList.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior

      console.log("clicked!");

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

  // Initialize category and page parameters
  const urlParams = new URLSearchParams(window.location.search);
  let category = urlParams.get('category') || 'nature';
  let page = Number(urlParams.get('page')) || 1;

  // Render images container
  this.renderImagesContainer(category, page);
};

ImageGridViewRenderer.prototype.renderImagesContainer = function (category, page) {
  // Update browser address bar with consistent format
  const searchParams = new URLSearchParams();
  searchParams.set('category', category);
  searchParams.set('page', page);
  window.history.replaceState({}, '', `?${searchParams.toString()}`);

  // Display loading animation
  const mainView = document.getElementById("main-view");
  mainView.innerHTML += `
    <div id="loading-animation" class="w-full text-center align-middle h-screen p-10 size-7">
      <div class="spinner-border w-full text-center align-middle flex-wrap h-screen size-10 p-5" role="status">
        <div class="sr-only text-center align-middle">Loading...</div>
      </div>
    </div>
  `;

  // Fetch images and populate the image grid
  const imagesContainer = `
    <div class="container mx-auto z-0 flex flex-wrap">
      <div id="${category}-images" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"></div>
    </div>
  `;
  mainView.innerHTML += imagesContainer;

  // Fetch images for the specified category and page
  for (let i = 0; i < 3; i++) {
    const index = (page * 3) - i;
    ImageDataGetter.getCatImagesFromPage(category, index)
      .then(images => {
        const imagesContainer = document.getElementById(`${category}-images`);
        images.forEach(element => {
          const imageHtml = `
            <div class="col flex" style="height: 400px; padding: 10px;">
              <img class="image" src="${element.url}" alt="${element.name}" style="height: 100%; object-fit: cover; width: 100%;" />
              <div class="middle">
                <a class="btn btn-dark" href="${element.url}" download="${element.name}">DOWNLOAD</a>
              </div>
            </div>
          `;
          imagesContainer.innerHTML += imageHtml;
        });
        document.getElementById('loading-animation').style.display = 'none';
      })
      .catch(error => {
        console.error(`Error fetching images: ${error}`);
      });
  }

  // Render pagination
  const prevSearchStr = window.location.search.split('&page')[0] + `&page=${page - 1}`;
  const nextSearchStr = window.location.search.split('&page')[0] + `&page=${page + 1}`;
  const pagination = `
    <nav class="w-full content-center grid grid-cols-2 fixed inset-x-0 bottom-0 z-10 pt-5">
      <div class="page-item text-center w-0.75"><a class="page-link text-gray-800 hover:text-cyan-700" href="${prevSearchStr}">Previous</a></div>
      <div class="page-item text-center w-0.75"><a class="page-link text-gray-800 hover:text-cyan-700" href="${nextSearchStr}">Next</a></div>
    </nav>
  `;
  mainView.innerHTML += pagination;
};
