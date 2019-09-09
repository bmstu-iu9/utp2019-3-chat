class Validator {

    constructor(options) {
        this.options = options;
        this.form = document.getElementById(options.id);
        this.elementsForm = [...this.form.children].filter(item => item.tagName !== 'BUTTON');
        this.error = new Set();
        this.pattern = {
            email: /^\w+@\w+\.\w+$/,
            password: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){6,}/g
        };
        for (let key in options.pattern){
            this.pattern[key] = options.pattern[key];
        }
    }

    validatorMethod = {
        notEmpty(elem) {
            return elem.value !== '';
        },
        pattern(elem, pattern) {
            return pattern.test(elem.value);
        },
        password_repeat(elem) {
            for (let i in this.elementsForm) {
                if (this.elementsForm[i].name === 'password') {
                    return this.elementsForm[i].value === elem.value;
                }
            }
        }
    };

    isValid(elem) {
        const method = this.options.method[elem.name];
        if (method !== undefined) {
            return method.every( item => this.validatorMethod[item[0]].bind(this)(elem, this.pattern[item[1]]));
        }
        return true;
    };

    showError(elem) {
        elem.classList.remove('validator_success');
        elem.classList.add('validator_error');
        if (!elem.nextElementSibling.classList.contains('error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = this.options.method['error_mess'][elem.name] ? this.options.method['error_mess'][elem.name] : 'Error this input';
            errorDiv.classList.add('error-message');
            elem.insertAdjacentElement('afterend', errorDiv);
        }
    };

    showSuccess(elem) {
        elem.classList.remove('validator_error');
        elem.classList.add('validator_success');
        if (elem.nextElementSibling.classList.contains('error-message')) {
            elem.nextElementSibling.remove();
        }
    };

    checkIt(event) {
        let target = event.target;
        if (this.isValid(target)){
            this.showSuccess(target);
            this.error.delete(target);
        } else {
            this.showError(target);
            this.error.add(target);
        }
    };

    listenForm() {
        this.elementsForm.forEach(elem => {
            elem.addEventListener('change', this.checkIt.bind(this));
        });
    };

    listenBtn() {
        this.elementsForm.forEach(elem => {
            this.checkIt({target: elem});
        });
        return !!this.error.size;
    };

    deleteError(clearFields) {
        this.elementsForm.forEach(elem => {
            elem.classList.remove('validator_error', 'validator_success');
            if (clearFields) elem.value = '';
            if (elem.nextElementSibling.classList.contains('error-message')) {
                elem.nextElementSibling.remove();
            }
        })
    };
}