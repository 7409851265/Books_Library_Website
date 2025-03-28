const searchInput = document.getElementById("search-input");
const sortSelects = document.querySelectorAll("#sort-select");
const gridViewBtn = document.getElementById("grid-view");
const listViewBtn = document.getElementById("list-view");
const booksContainer = document.getElementById("books-container");
const prevPageBtn = document.getElementById("prev-btn");
const nextPageBtn = document.getElementById("next-btn");
const pageNumbersContainer = document.getElementById("page-numbers");

let currentPage = 1;
const booksPerPage = 12;

async function fetchData() {
  try {
    let response = await fetch(
      "https://api.freeapi.app/api/v1/public/books?limit=210"
    );
    let data = await response.json();
    let booksData = data.data.data;

    // render all data when website opens
    allBooks(booksData);

    // prev and next page changer
    prevPageBtn.addEventListener("click", () =>
      changePage(currentPage - 1, booksData)
    );
    nextPageBtn.addEventListener("click", () =>
      changePage(currentPage + 1, booksData)
    );

    // list and grid view
    listViewBtn.addEventListener("click", () => {
      booksContainer.classList.remove("grid-view");
      booksContainer.classList.add("list-view");
      document.querySelector(".pagination").style.display = "block";
    });

    gridViewBtn.addEventListener("click", () => {
      booksContainer.classList.remove("list-view");
      booksContainer.classList.add("grid-view");
      document.querySelector(".pagination").style.display = "block";
    });

    // search books
    searchInput.addEventListener("input", function () {
      let input = searchInput.value.toLowerCase().trim();
      let filteredBooks = booksData.filter(
        (data) =>
          data.volumeInfo.title.toLowerCase().includes(input) ||
          (data.volumeInfo.authors &&
            data.volumeInfo.authors.some((author) =>
              author.toLowerCase().includes(input)
            ))
      );

      booksContainer.innerHTML = "";
      document.querySelector(".pagination").style.display =
        filteredBooks.length > 0 ? "block" : "none";

      if (filteredBooks.length > 0) {
        allBooks(filteredBooks);
      } else {
        const Note = document.createElement("h2");
        Note.innerText = "Book Not Found / Not Available....";
        Note.classList.add("noBooks");
        booksContainer.appendChild(Note);
      }
    });

    // sorting with title and date
    sortSelects.forEach((sortSelect) => {
      sortSelect.addEventListener("change", () => {
        booksContainer.innerHTML = "";

        let sortedBooks = [...booksData];

        if (sortSelect.value === "title") {
          sortedBooks.sort((a, b) =>
            a.volumeInfo.title.localeCompare(b.volumeInfo.title)
          );
        } else {
          sortedBooks.sort(
            (a, b) =>
              new Date(a.volumeInfo.publishedDate) -
              new Date(b.volumeInfo.publishedDate)
          );
        }
        document.querySelector(".pagination").style.display = "block";

        allBooks(sortedBooks);
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// common function for rendring all books
function allBooks(array) {
  const totalPages = Math.ceil(array.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = array.slice(startIndex, endIndex);

  updatePagination(totalPages, array);

  booksContainer.innerHTML = "";

  currentBooks.forEach((data) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    const bookCover = document.createElement("div");
    bookCover.classList.add("book-cover");

    const bookInfo = document.createElement("div");
    bookInfo.classList.add("book-info");

    const info = document.createElement("a");
    info.href = data.volumeInfo.infoLink;
    info.target = "_blank";
    const img = document.createElement("img");
    img.src =
      data.volumeInfo.imageLinks?.thumbnail ||
      "http://books.google.com/books/content?id=lAOqDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
    img.alt = data.volumeInfo.title;
    const title = document.createElement("h4");
    title.innerText = `Title: ${data.volumeInfo.title}`;
    title.classList.add("book-title");
    const author = document.createElement("p");
    author.innerText = `Author: ${data.volumeInfo.authors}`;
    author.classList.add("book-author");
    const publisher = document.createElement("p");
    publisher.innerText = `Publishers: ${data.volumeInfo.publisher}`;
    publisher.classList.add("book-publisher");
    const publishDate = document.createElement("p");
    publishDate.innerText = `Published On: ${data.volumeInfo.publishedDate}`;
    publishDate.classList.add("book-date");

    info.appendChild(img);
    bookCover.appendChild(info);

    bookInfo.appendChild(title);
    bookInfo.appendChild(author);
    bookInfo.appendChild(publisher);
    bookInfo.appendChild(publishDate);

    bookCard.appendChild(bookCover);
    bookCard.appendChild(bookInfo);

    booksContainer.appendChild(bookCard);
  });
}

// change page
function changePage(page, array = booksData) {
  currentPage = page;
  allBooks(array);
}

// update pagination
function updatePagination(totalPages, array) {
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

  pageNumbersContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.className = i === currentPage ? "active" : "";
    pageBtn.addEventListener("click", () => changePage(i, array));
    pageNumbersContainer.appendChild(pageBtn);
  }
}

// calling fetch API function after writing all the code
fetchData();
