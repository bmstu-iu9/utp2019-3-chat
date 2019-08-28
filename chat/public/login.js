const URL = 'http://localhost:3000/';
const nameFormSignIn = 'form-signin';
const nameFormSignUp = 'form-signup';

const validatorSignIn = new Validator({
    id: nameFormSignIn,
    method: {
        'login': [
            ['notEmpty']
        ],
        'password': [
            ['notEmpty']
        ],
        'error_mess': {
            'login': 'Enter your login',
            'password': 'Enter your password'
        }
    }
});

const validatorSignUp = new Validator({
    id: nameFormSignUp,
    method: {
        'login': [
            ['notEmpty']
        ],
        'email': [
            ['notEmpty'],
            ['pattern', 'email']
        ],
        'password': [
            ['notEmpty'],
            ['pattern', 'password']
        ],
        'password_repeat': [
            ['notEmpty'],
            ['password_repeat']
        ],
        'error_mess': {
            'login': 'Enter your login',
            'password': 'Password must contain UpperCase, LowerCase, Number and min 6 Chars',
            'email': 'Enter your email',
            'password_repeat': 'Passwords do not match'
        }
    }
});

validatorSignIn.listenForm();
validatorSignUp.listenForm();

function changeClassNameForm(...newOldId) {
    let _newIdName = document.getElementById(newOldId[0]);
    let _oldIdName = document.getElementById(newOldId[1]);
    _newIdName.className = '';
    _oldIdName.className = 'hidden';
}