
export let accountData = JSON.parse(localStorage.getItem('accountData')) || [
    { Fname: 'Christian', Lname: 'Gonzalez', Role: 'Work', Profile: 'assets/profile.png', Password: 'Chan28' },
    { Fname: 'Christian', Lname: 'Pogi', Role: 'Personal', Profile: 'assets/profile.png', Password: 'Chan28' },
    { Fname: 'Christian', Lname: 'Gonzalez', Role: 'School', Profile: 'assets/profile.png', Password: 'Chan28' }
];

let names = JSON.parse(localStorage.getItem('names')) || {}; // Object to store input values by account index

function renderHtml() {
    const accountsContainer = document.querySelector('.accounts-container');
    if (!accountsContainer) {
        console.error('Element with class "accounts-container" not found.');
        return;
    }

    let renderAccount = '';
    accountData.forEach((Data, index) => {
        renderAccount += `
            <div class="account" data-index="${index}">
                <div class="edit-icon">
                    <box-icon name='dots-vertical-rounded' color='#E0E0E0'></box-icon>
                </div>
                <div class="edit-options">
                    <div class="edit"><box-icon name='edit-alt' type='solid' color='#b1b1b1'></box-icon>Edit</div>
                    <div class="delete"><box-icon name='trash-alt' type='solid' color='#b1b1b1'></box-icon>Delete</div>
                </div>
                <div class="account-header">    
                    <input type="text" name="" class="role" data-index="${index}" value="${Data.Role}">
                    <div class="underline"></div>
                </div>
                <div class="account-img-text">
                    <div class="img-container">
                        <img src="${Data.Profile}" alt="">
                    </div>
                    <div class="name-container">
                        <p>${Data.Fname} ${Data.Lname}</p>
                    </div>
                </div>
            </div>`;
    });

    accountsContainer.innerHTML = renderAccount;
    
    const addProfileHtml = `
    <div class="add-profile" id="add-profile">
        <div class="account-header">
            <span>Add</span>
        </div>
        <div class="account-img-text">
            <div class="img-container">
                <img src="assets/plus-regular-60.png" alt="">
            </div>
        </div>
    </div>`;
    accountsContainer.insertAdjacentHTML('beforeend', addProfileHtml); // insert the add profile container 

    const addNewAccount = document.getElementById("add-profile");
    const addNewInput = document.querySelector('.add-new-account');
    const dimEffect = document.querySelector('.dim-effect');

    if (addNewAccount) {
        addNewAccount.addEventListener('click', () => {
            addNewInput.classList.toggle('active');
            dimEffect.classList.toggle('active');
        });
    }

    if (dimEffect) {
        dimEffect.addEventListener('click', () => {
            addNewInput.classList.remove('active');
            dimEffect.classList.remove('active');
        });
    }

    addEventListeners(); // Ensure event listeners are added after rendering
}

function addEventListeners() {
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete').forEach((deleteButton, index) => {
        deleteButton.addEventListener('click', () => {
            accountData.splice(index, 1);
            delete names[index]; // Remove the corresponding entry from names
            
            // Update the indices in names
            const updatedNames = {};
            accountData.forEach((_, i) => {
                if (names[i]) {
                    updatedNames[i] = names[i];
                }
            });
            names = updatedNames;

            saveAccountDataToLocalStorage(); // Update accountData in local storage
            saveNamesToLocalStorage(); // Update names in local storage
            renderHtml();
        });
    });

    // Add event listeners for edit icons
    document.querySelectorAll('.edit-icon').forEach(editIcon => {
        editIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the click from propagating to the document

            const currentEditOptions = this.nextElementSibling; // Get the next sibling, which is .edit-options

            // Close all other edit options except the current one
            document.querySelectorAll('.edit-options').forEach(editOptions => {
                if (editOptions !== currentEditOptions) {
                    editOptions.classList.remove('active');
                }
            });

            currentEditOptions.classList.toggle('active');
        });
    });

    // Add event listeners for name inputs
    // document.querySelectorAll('.name').forEach(inputField => {
    //     const index = inputField.getAttribute('data-index');

    //     // Set the input field value from stored names if available
    //     inputField.value = names[index] || '';
    
    //     inputField.addEventListener('change', function() {
    //         // Save the input value to the names object
    //         names[index] = this.value;
        
    //         // Save the names object to LocalStorage
    //         saveNamesToLocalStorage();
    //     });
    // });

    // Add event listeners for role inputs
    document.querySelectorAll('.role').forEach(roleField => {
        const index = roleField.getAttribute('data-index');
        
        roleField.addEventListener('change', function() {
            // Update the role in accountData
            accountData[index].Role = this.value;

            // Save the updated accountData to LocalStorage
            saveAccountDataToLocalStorage();
        });
    });
}

function saveAccountDataToLocalStorage() {
    localStorage.setItem('accountData', JSON.stringify(accountData));
}

function saveNamesToLocalStorage() {
    localStorage.setItem('names', JSON.stringify(names));
}

function loadNamesFromLocalStorage() {
    const storedNames = JSON.parse(localStorage.getItem('names')) || {};
    names = storedNames;
    document.querySelectorAll('.name').forEach(inputField => {
        const index = inputField.getAttribute('data-index');
        inputField.value = names[index] || '';
    });
}

function closeAllEditOptions() {
    document.querySelectorAll('.edit-options').forEach(editOptions => {
        editOptions.classList.remove('active');
    });
}

// Event listeners for clicking outside of edit options
document.addEventListener('click', () => {
    closeAllEditOptions();
});

// Initial render and load names
renderHtml();
loadNamesFromLocalStorage();


// Form validation and submission
const form = document.getElementById('accountForm');
const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const role = document.getElementById('role');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('password2');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateInput()) {
        // Push the new account data
        accountData.push({
            Fname: fname.value.trim(),
            Lname: lname.value.trim(),
            Role: role.value.trim(),
            Profile: 'assets/profile.png',
            Password: password.value.trim()
        });

        // Save the updated accountData to LocalStorage
        saveAccountDataToLocalStorage();

        // Re-render the HTML
        renderHtml();

        // Clear form fields after submission
        form.reset();

        // Hide the "Add New Account" input
        document.querySelector('.add-new-account').classList.remove('active');
        document.querySelector('.dim-effect').classList.remove('active');
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    
    errorDisplay.innerText = message;
    errorDisplay.style.display = 'block';
    element.classList.add('invalid');
    element.classList.remove('valid');
}

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    
    errorDisplay.innerText = '';
    errorDisplay.style.display = 'none';
    element.classList.add('valid');
    element.classList.remove('invalid');
}

const validateInput = () => {
    const fnameValue = fname.value.trim();
    const lnameValue = lname.value.trim();
    const roleValue = role.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();
    
    let isValid = true;

    if (fnameValue === '') {
        setError(fname, 'First name is required');
        isValid = false;
    } else {
        setSuccess(fname);
    }

    if (lnameValue === '') {
        setError(lname, 'Last name is required');
        isValid = false;
    } else {
        setSuccess(lname);
    }

    if (roleValue === '') {
        setError(role, 'Role is required');
        isValid = false;
    } else {
        setSuccess(role);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');
        isValid = false;
    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 characters');
        isValid = false;
    } else {
        setSuccess(password);
    }

    if (confirmPasswordValue === '') {
        setError(confirmPassword, 'Please confirm your password');
        isValid = false;
    } else if (confirmPasswordValue !== passwordValue) {
        setError(confirmPassword, "Passwords don't match");
        isValid = false;
    } else {
        setSuccess(confirmPassword);
    }

    return isValid;
}

const togglePasswordIcons = document.querySelectorAll('.toggle-password');

togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const inputField = icon.previousElementSibling.previousElementSibling.previousElementSibling;

        // Toggle input type between 'password' and 'text'
        if (inputField.type === 'password') {
            inputField.type = 'text';
            icon.classList.replace('bx-low-vision', 'bx-show');
            icon.style.color = '#ffffff';
        } else {
            inputField.type = 'password';
            icon.classList.replace('bx-show', 'bx-low-vision');
            icon.style.color = '#E0E0E0';
        }
    });
});

 
