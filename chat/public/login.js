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
