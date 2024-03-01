
document.addEventListener('DOMContentLoaded', function() {
    // collect all necessary elements from the DOM
    const getDataBtn = document.getElementById('getDataBtn');
    const filterParam = document.getElementById('filterParam');
    const filterInput = document.getElementById('filterInput');
    const userData = document.getElementById('userData');
    const userDataBody = document.getElementById('userDataBody');
    const container = document.getElementById('container');
    const userTable = document.getElementById('userTable');

    // track if the button was clicked for the first time (flag)
    let firstClick = true;

    // add event listener to the 'Request' button
    getDataBtn.addEventListener('click', function() {
        // if it is the first click - update button text and do some initial actions
        if (firstClick) {
            getDataBtn.textContent = 'Update';
            firstClick = false;
            document.getElementById('getDataBtnContainer').classList.add('shift-up');
            document.getElementById('spacer').style.display = 'block'; 
        }
        // fetch user data and adjust container position
        fetchData();
        container.classList.remove('centered');
    });

    // function to fetch user data from API
    function fetchData() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(renderUserData)
            .catch(handleError);
    }

    // function to render user data into the table
    function renderUserData(data) {
        userDataBody.innerHTML = '';
        data.forEach(user => {
            userDataBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.address.street}, ${user.address.city}, ${user.address.zipcode}</td>
                    <td>${user.phone}</td>
                    <td>${user.website}</td>
                    <td>${user.company.name}</td>
                </tr>
            `;
        });
        // display user data table and set up filters and sorting
        userData.style.display = 'block';
        setupFilters();
        setupSorting();
    }

    // function to set up filter functionality
    function setupFilters() {
        filterParam.addEventListener('change', applyFilter);
        filterInput.addEventListener('input', applyFilter);
    }

    // function to set up sorting functionality
    function setupSorting() {
        const sortableHeaders = document.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                sortTable(column);
            });
        });
    }

    // function to apply filter based on user inputed values
    function applyFilter() {
        const filterParamValue = filterParam.value.toLowerCase();
        const filterInputValue = filterInput.value.toLowerCase();
        const rows = document.querySelectorAll('#userDataBody tr');
        rows.forEach(row => {
            const rowData = row.querySelector(`td:nth-child(${getColumnIndex(filterParamValue)})`).textContent.toLowerCase();
            row.style.display = rowData.includes(filterInputValue) ? '' : 'none';
        });
    }

    // function to sort the table based on a clicked header
    function sortTable(column) {
        const tbody = userTable.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const cellA = a.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent;
            const cellB = b.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent;
            return column === 'id' ? parseInt(cellA) - parseInt(cellB) : cellA.localeCompare(cellB);
        });
        rows.forEach(row => tbody.appendChild(row));
    }

    // function to get the index of a column by its header text
    function getColumnIndex(headerText) {
        const headers = document.querySelectorAll('#userTable th');
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].textContent.toLowerCase() === headerText.toLowerCase()) {
                return i + 1;
            }
        }
        return -1;
    }

    // function to handle errors during data fetching
    function handleError(error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data. Please try again later.');
    }
});
