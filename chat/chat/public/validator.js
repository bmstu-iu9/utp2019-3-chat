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
        notEmpty(elem){
            return elem.value !== '';
        },
        pattern(elem, pattern) {
            return pattern.test(elem.value);
        },
        password_repeat(elem) {
            for (let i in this.elementsForm) {
                if (this.elementsForm[i].name === 'password'){
                    return this.elementsForm[i].value ===elem.value;
                }
            }
        }
    };

    isValid(elem) {
        const method = this.options.method[elem.name];
        if (method !== undefined) {
            return method.every(item => this.validatorMethod[item[0]].bind(this)(elem, this.pattern[item[1]]));
        }
        return true;
    };
}