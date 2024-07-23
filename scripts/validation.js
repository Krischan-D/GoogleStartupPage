import { accountData } from '../scripts/scripts.js';

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