const accountData = [{
    Fname: 'Christian',
    Lname: 'Gonzalez',
    Role: 'Work',
    Profile: 'assets/profile.png',
    Password: 'Chan28'
}, {
    Fname: 'Christian',
    Lname: 'Gonzalez',
    Role: 'Work',
    Profile: 'assets/profile.png',
    Password: 'Chan28'
}];

const deleteAccount = document.querySelectorAll('.delete');
const inputFname = document.querySelector('.inputFname');
const inputLname = document.querySelector('.inputLname');
const inputRole = document.querySelector('.inputRole');
const inputPassword = document.querySelector('.inputPassword');
const inputConfirmPassword = document.querySelector('.inputConfirmPassword');

function InputValues() {
    const Fname = inputFname.value;
    const Lname = inputLname.value;
    const Role = inputRole.value;
    const Password = inputPassword.value;
    const ConfirmPassword = inputConfirmPassword.value;
    
    return { Fname, Lname, Role, Password, ConfirmPassword };
}

function addProfile() {
    const { Fname, Lname, Role, Password, ConfirmPassword } = InputValues();

    if (Password === ConfirmPassword) {
        accountData.push({
            Fname: Fname,
            Lname: Lname,
            Role: Role,
            Profile: 'assets/profile.png',
            Password: Password
        });

        renderHtml();
    } else {
        alert('Passwords do not match');
    }
}

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
                    <box-icon name='dots-vertical-rounded' color='#000000' ></box-icon>
                </div>
                <div class="edit-options">
                    <div class="edit"><box-icon name='edit-alt' type='solid' color='#b1b1b1' ></box-icon>Edit</div>
                    <div class="delete"><box-icon name='trash-alt' type='solid' color='#b1b1b1' ></box-icon>Delete</div>
                </div>wa
                <div class="account-header">
                    <input type="text" name="" class="name">
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
            </div>
                    `;
    });

    accountsContainer.innerHTML = renderAccount;
    addEventListeners();
    loadNamesFromLocalStorage();
}

function addEventListeners() {
    document.querySelectorAll('.delete').forEach((deleteButton, index) => {
        deleteButton.addEventListener('click', () => {
            accountData.splice(index, 1);
            renderHtml();
        });
    });

    document.querySelectorAll('.name').forEach((inputField, index) => {
        inputField.value = accountData[index].Fname + ' ' + accountData[index].Lname;
        inputField.addEventListener('change', function() {
            const nameParts = this.value.split(' ');
            accountData[index].Fname = nameParts[0];
            accountData[index].Lname = nameParts.slice(1).join(' ');
            saveNamesToLocalStorage();
        });
    });
}

function saveNamesToLocalStorage() {
    const names = accountData.map(account => account.Fname + ' ' + account.Lname);
    localStorage.setItem('names', JSON.stringify(names));
}

function loadNamesFromLocalStorage() {
    const names = JSON.parse(localStorage.getItem('names')) || [];
    document.querySelectorAll('.name').forEach((inputField, index) => {
        if (names[index]) {
            inputField.value = names[index];
            const nameParts = names[index].split(' ');
            accountData[index].Fname = nameParts[0];
            accountData[index].Lname = nameParts.slice(1).join(' ');
        }
    });
}

// Initial render
renderHtml();
