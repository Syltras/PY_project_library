const MY_SERVER = "http://127.0.0.1:5000";

const loadData = async () => {
  const booksResponse = await axios.get(`${MY_SERVER}/books`);
  const customersResponse = await axios.get(`${MY_SERVER}/customers`);
  const loansResponse = await axios.get(`${MY_SERVER}/loans`);

  const booksData = booksResponse.data;
  const customersData = customersResponse.data;
  const loansData = loansResponse.data;

  displayBooks(booksData);
  displayCustomers(customersData);
  displayLoans(loansData);
};

const displayBooks = (booksData) => {
  const booksDiv = document.getElementById('Books');
  booksDiv.innerHTML = '';
  booksData.forEach(book => {
    const bookDiv = createBookDiv(book);
    booksDiv.appendChild(bookDiv);
  });
};

const displayCustomers = (customersData) => {
  const customersDiv = document.getElementById('Customers');
  customersDiv.innerHTML = '';
  customersData.forEach(customer => {
    const customerDiv = createCustomerDiv(customer);
    customersDiv.appendChild(customerDiv);
  });
};

const displayLoans = (loansData) => {
  const loansDiv = document.getElementById('Loans');
  loansDiv.innerHTML = '';
  loansData.forEach(loan => {
    const loanDiv = createLoanDiv(loan);
    loansDiv.appendChild(loanDiv);
  });
};

const createBookDiv = (book) => {
  const bookDiv = document.createElement('div');
  bookDiv.innerHTML = `
    <p>Book ID: ${book.id}, Author: ${book.book_author}, Name: ${book.book_name}, Year: ${book.book_year}, Type: ${book.book_type}</p>
    <button onclick="deleteBook(${book.id})">Delete</button>
    <button onclick="updateBook(${book.id})">Update</button>
  `;
  return bookDiv;
};

const createCustomerDiv = (customer) => {
  const customerDiv = document.createElement('div');
  customerDiv.innerHTML = `
    <p>Customer ID: ${customer.id}, Name: ${customer.cust_name}, City: ${customer.cust_city}, Age: ${customer.cust_age}</p>
    <button onclick="deleteCustomer(${customer.id})">Delete</button>
    <button onclick="updateCustomer(${customer.id})">Update</button>
  `;
  return customerDiv;
};

const createLoanDiv = (loan) => {
  const loanDiv = document.createElement('div');
  loanDiv.innerHTML = `
    <p>Loan ID: ${loan.id}, Customer ID: ${loan.cust_id}, Book ID: ${loan.book_id}, Loan Date: ${loan.loanDate}, Return Date: ${loan.returnDate}</p>
    <button onclick="deleteLoan(${loan.id})">Return</button>
  `;
  return loanDiv;
};

const newBook = async () => {
  const author = document.getElementById('author').value;
  const bookName = document.getElementById('book_name').value;
  const bookYear = document.getElementById('book_year').value;
  const bookType = document.getElementById('book_type').value; 

  // Validate book_author
  if (author === '') {
    Toastify({
      text: "Please enter author name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (!/^[A-Za-z\s."]+$/.test(author)) {
    Toastify({
      text: "Author name should only contain letters, spaces, dots, and symbols.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  // Validate book_name
  if (bookName === '') {
    Toastify({
      text: "Please enter book name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  // Validate book_year
  if (bookYear === '') {
    Toastify({
      text: "Please enter the year of publication.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (isNaN(bookYear) || bookYear.length >= 5) {
    Toastify({
      text: "Invalid publication year.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  const newBookData = {
    book_author: author,
    book_name: bookName,
    book_year: bookYear,
    book_type: bookType
  };

  await axios.post(`${MY_SERVER}/books/new`, newBookData);
  loadData();
};

// New customer
const newCustomer = async () => {
  const custName = document.getElementById('cust_name').value;
  const custCity = document.getElementById('cust_city').value;
  const custAge = document.getElementById('cust_age').value;

  // Validate cust_name
  if (custName === '') {
    Toastify({
      text: "Please enter the customer's name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (!/^[A-Za-z\s]+$/.test(custName)) {
    Toastify({
      text: "Please enter a valid name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  // Validate cust_city
  if (custCity === '') {
    Toastify({
      text: "Please enter a city name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (!/^[A-Za-z,-." ]+$/.test(custCity)) {
    Toastify({
      text: 'Please enter valid city name.',
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
}

  // Validate cust_age
  if (custAge === '') {
    Toastify({
      text: "Please enter customer's age.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (isNaN(custAge) || custAge <= 3 || custAge >= 120) {
    Toastify({
      text: 'Invalid customer age, must be over three years old.',
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  const newCustomerData = {
    cust_name: custName,
    cust_city: custCity,
    cust_age: custAge
  };

  await axios.post(`${MY_SERVER}/customers/new`, newCustomerData);
  loadData();
};

// New loan
const newLoan = async () => {
  const custId = document.getElementById('loan_cust_id').value;
  const bookId = document.getElementById('loan_book_id').value;

  // Fetch book data from the server
  const bookResponse = await axios.get(`${MY_SERVER}/books/${bookId}`);
  const bookType = bookResponse.data.book_type;

  const newLoanData = {
    cust_id: custId,
    book_id: bookId,
    book_type: bookType
  };

  try {
    const response = await axios.post(`${MY_SERVER}/loans/new`, newLoanData);
    if (response.status === 200) {
      // Loan record created successfully
      loadData();
    } 

  } catch (error) {
    // Handle error responses from the server
    Toastify({
      text: error.response.data.error,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
  }
};

// Delete Book
const deleteBook = async (id) => {
  await axios.delete(`${MY_SERVER}/books/del/${id}`);
  loadData();
};

const deleteCustomer = async (id) => {
  try {
    await axios.delete(`${MY_SERVER}/customers/del/${id}`);

  } catch (error) {
    // Handle error responses from the server
    Toastify({
      text: error.response.data.error,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
  }

  loadData();
};
const deleteLoan = async (id) => {
  await axios.delete(`${MY_SERVER}/loans/del/${id}`);
  loadData();
};

const updateBook = async (id) => {
    const author = document.getElementById('author').value;
    const bookName = document.getElementById('book_name').value;
    const bookYear = document.getElementById('book_year').value;
    const bookType = document.getElementById('book_type').value;
    // Validate book_author
  if (author === '') {
    Toastify({
      text: "Please enter author's name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (!/^[A-Za-z\s."]+$/.test(author)) {
    Toastify({
      text: "Please enter valid author name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  // Validate book_name
  if (bookName === '') {
    Toastify({
      text: "Please enter book name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  // Validate book_year
  if (bookYear === '') {
    Toastify({
      text: "Please enter book year.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (isNaN(bookYear) || bookYear.length >= 5) {
    Toastify({
      text: "Invalid book year.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  
    const updatedBookData = {
      book_author: author,
      book_name: bookName,
      book_year: bookYear,
      book_type: bookType
    };
  
    await axios.put(`${MY_SERVER}/books/upd/${id}`, updatedBookData);
    loadData();
  };
  
  const updateCustomer = async (id) => {
    const custName = document.getElementById('cust_name').value;
    const custCity = document.getElementById('cust_city').value;
    const custAge = document.getElementById('cust_age').value;

    // Validate cust_name
  if (custName === '') {
    Toastify({
      text: "Please enter customer's name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (!/^[A-Za-z\s.' ]+$/.test(custName)) {
    Toastify({
      text: "Please enter valid customer name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
}

  // Validate cust_city
  if (custCity === '') {
    Toastify({
      text: "Please enter city's name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (!/^[A-Za-z\s.'"]+$/.test(custCity)) {
    Toastify({
      text: "Please enter valid city name.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  // Validate cust_age
  if (custAge === '') {
    Toastify({
      text: "Please enter customer's age.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }

  if (isNaN(custAge) || custAge < 0 || custAge >= 120) {
    Toastify({
      text: "Invalid customer age, must be over three years old.",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
    }).showToast();
    return;
  }
  
    const updatedCustomerData = {
      cust_name: custName,
      cust_city: custCity,
      cust_age: custAge
    };
  
    await axios.put(`${MY_SERVER}/customers/upd/${id}`, updatedCustomerData);
    loadData();
  };
  
  const showBooks = () => {
    const dataDisplayDiv = document.getElementById('DataDisplay');
    dataDisplayDiv.innerHTML = '';
    const booksDiv = document.getElementById('Books');
    dataDisplayDiv.innerHTML = booksDiv.innerHTML;
};

const showCustomers = () => {
    const dataDisplayDiv = document.getElementById('DataDisplay');
    dataDisplayDiv.innerHTML = '';
    const customersDiv = document.getElementById('Customers');
    dataDisplayDiv.innerHTML = customersDiv.innerHTML;
};

const showLoans = () => {
    const dataDisplayDiv = document.getElementById('DataDisplay');
    dataDisplayDiv.innerHTML = '';
    const loansDiv = document.getElementById('Loans');
    dataDisplayDiv.innerHTML = loansDiv.innerHTML; 
};

const showSection = (section) => {
  const dataDisplayDiv = document.getElementById('DataDisplay');
  dataDisplayDiv.innerHTML = '';

  const booksSection = document.getElementById('BooksSection');
  const customersSection = document.getElementById('CustomersSection');
  const loansSection = document.getElementById('LoansSection');

  if (section === 'Books') {
    dataDisplayDiv.innerHTML = booksSection.innerHTML;
  } else if (section === 'Customers') {
    dataDisplayDiv.innerHTML = customersSection.innerHTML;
  } else if (section === 'Loans') {
    dataDisplayDiv.innerHTML = loansSection.innerHTML;
  }
};
  
const updateData = () => {
  loadData();
};

const searchBooks = async () => {
  const searchQuery = document.getElementById('searchBookInput').value;
  const searchResponse = await axios.get(`${MY_SERVER}/books/search/${searchQuery}`);
  const searchResultsDiv = document.getElementById('bookSearchResults');
  searchResultsDiv.innerHTML = '';
  searchResponse.data.forEach(book => {
      const bookDiv = createBookDiv(book);
      searchResultsDiv.appendChild(bookDiv);
  });
};

const searchCustomers = async () => {
  const searchQuery = document.getElementById('searchCustomerInput').value;
  const searchResponse = await axios.get(`${MY_SERVER}/customers/search/${searchQuery}`);
  const searchResultsDiv = document.getElementById('customerSearchResults');
  searchResultsDiv.innerHTML = '';
  searchResponse.data.forEach(customer => {
      const customerDiv = createCustomerDiv(customer);
      searchResultsDiv.appendChild(customerDiv);
  });
};

const showOverdueBooksBtn = document.getElementById('show-overdue-books-btn');

// add a click event listener to the button
showOverdueBooksBtn.addEventListener('click', showOverdueBooks);

// define the showOverdueBooks function
function showOverdueBooks() {
  const overdueBooksContainer = document.getElementById('overdue-books-container');

  // toggle container visibility
  overdueBooksContainer.style.display = overdueBooksContainer.style.display === 'none' ? 'block' : 'none';

  // if the container is invisible, fetch the overdue books
  if (overdueBooksContainer.style.display === 'none') {
    return;
  }

  axios.get(`${MY_SERVER}/books-overdue`)
    .then(response => {
      let html = '';
      response.data.forEach(book => {
        html += `<div class="book">
                    <h3>${book.book_name}</h3>
                    <p>Author: ${book.book_author}</p>
                    <p>Book ID: ${book.book_id}</p>
                    <p>Customer ID: ${book.cust_id}</p>
                    <p>Return Date: ${book.returnDate}</p>
                  </div>`;
      });

      overdueBooksContainer.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}
// create a new container for the list of overdue books
const container = document.createElement('div');
container.id = 'overdue-books-container';
document.body.appendChild(container);

// Call the loadData function to fetch and display initial data
loadData();
