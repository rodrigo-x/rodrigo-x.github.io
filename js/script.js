// Função para criar partículas animadas
function createParticles() {
    const bgAnimation = document.querySelector('.bg-animation');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        bgAnimation.appendChild(particle);
    }
}

// Remover overlay de loading
function removeLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }
}

// Classe para validação de formulário
class FormValidator {
    static validateName(name) {
        if (!name || name.trim().length < 4) {
            return 'Nome deve ter pelo menos 4 caracteres';
        }
        if (name.trim().length > 50) {
            return 'Nome deve ter no máximo 50 caracteres';
        }
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
            return 'Nome deve conter apenas letras e espaços';
        }
        return null;
    }

    static validateEmail(email) {
        if (!email || !email.trim()) {
            return 'Email é obrigatório';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return 'Email deve ter um formato válido';
        }
        if (email.trim().length > 100) {
            return 'Email deve ter no máximo 100 caracteres';
        }
        return null;
    }

    static validateMessage(message) {
        if (!message || message.trim().length < 10) {
            return 'Mensagem deve ter pelo menos 10 caracteres';
        }
        if (message.trim().length > 500) {
            return 'Mensagem deve ter no máximo 500 caracteres';
        }
        return null;
    }

    static validateAll(formData) {
        const errors = {};

        const nameError = this.validateName(formData.name);
        if (nameError) errors.name = nameError;

        const emailError = this.validateEmail(formData.email);
        if (emailError) errors.email = emailError;

        const messageError = this.validateMessage(formData.message);
        if (messageError) errors.message = messageError;

        return errors;
    }
}

// Classe principal do formulário de contato
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.originalBtnText = this.submitBtn.innerHTML;
        this.messageField = document.getElementById('message');
        this.charCount = document.getElementById('char-count');

        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupRealTimeValidation();
        this.setupCharacterCounter();
    }

    setupRealTimeValidation() {
        const fields = ['name', 'email', 'message'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('blur', () => this.validateField(fieldId));
            field.addEventListener('input', () => this.clearFieldError(fieldId));
        });
    }

    setupCharacterCounter() {
        this.messageField.addEventListener('input', () => {
            const length = this.messageField.value.length;
            this.charCount.textContent = `${length}/500`;

            this.charCount.className = 'character-count';
            if (length > 450) {
                this.charCount.classList.add('warning');
            }
            if (length > 500) {
                this.charCount.classList.add('error');
            }
        });
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        let error = null;

        switch (fieldId) {
            case 'name':
                error = FormValidator.validateName(value);
                break;
            case 'email':
                error = FormValidator.validateEmail(value);
                break;
            case 'message':
                error = FormValidator.validateMessage(value);
                break;
        }

        if (error) {
            this.displayFieldError(fieldId, error);
        } else {
            this.clearFieldError(fieldId);
            this.markFieldAsValid(fieldId);
        }

        return !error;
    }

    displayFieldError(fieldId, errorMessage) {
        const formGroup = document.getElementById(fieldId).closest('.form-group');
        const errorElement = document.getElementById(`error-${fieldId}`);

        formGroup.classList.remove('success');
        formGroup.classList.add('error');

        errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`;
        errorElement.classList.add('show');
    }

    clearFieldError(fieldId) {
        const formGroup = document.getElementById(fieldId).closest('.form-group');
        const errorElement = document.getElementById(`error-${fieldId}`);

        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        errorElement.innerHTML = '';
    }

    markFieldAsValid(fieldId) {
        const formGroup = document.getElementById(fieldId).closest('.form-group');
        formGroup.classList.add('success');
    }

    resetAllErrors() {
        const formGroups = document.querySelectorAll('.form-group');
        const errorElements = document.querySelectorAll('.error-message');

        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });

        errorElements.forEach(error => {
            error.classList.remove('show');
            error.innerHTML = '';
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        this.resetAllErrors();

        const errors = FormValidator.validateAll(formData);

        if (Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([field, msg]) => {
                this.displayFieldError(field, msg);
            });
            this.showNotification('Por favor, corrija os erros no formulário.', false);
            return;
        }

        await this.submitForm();
    }

    async submitForm() {
        this.setButtonLoading(true);

        try {
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: new FormData(this.form)
            });

            if (response.ok) {
                this.showNotification('Mensagem enviada com sucesso!', true);
                this.setButtonSuccess();

                setTimeout(() => {
                    this.resetForm();
                }, 2000);
            } else {
                throw new Error('Erro na resposta do servidor');
            }

        } catch (error) {
            console.error('Erro ao enviar:', error);
            this.showNotification('Falha ao enviar a mensagem. Tente novamente.', false);
            this.setButtonError();

            setTimeout(() => {
                this.resetButton();
            }, 2000);
        }
    }

    setButtonLoading(loading) {
        if (loading) {
            this.submitBtn.innerHTML = '<div class="loading-spinner"></div> Enviando...';
            this.submitBtn.disabled = true;
        } else {
            this.resetButton();
        }
    }

    setButtonSuccess() {
        this.submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
        this.submitBtn.style.background = 'linear-gradient(45deg, var(--success-color), #00e676)';
    }

    setButtonError() {
        this.submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro!';
        this.submitBtn.style.background = 'linear-gradient(45deg, var(--error-color), #ff6b6b)';
    }

    resetButton() {
        this.submitBtn.innerHTML = this.originalBtnText;
        this.submitBtn.disabled = false;
        this.submitBtn.style.background = 'linear-gradient(45deg, var(--primary-color), var(--accent-color))';
    }

    resetForm() {
        this.form.reset();
        this.resetAllErrors();
        this.resetButton();
        this.charCount.textContent = '0/500';
        this.charCount.className = 'character-count';
    }

    showNotification(message, isSuccess = true) {
        let notification = document.querySelector('.notification');

        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }

        const icon = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        notification.innerHTML = `<i class="${icon}"></i> ${message}`;
        notification.className = `notification ${isSuccess ? 'success' : 'error'}`;

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    removeLoadingOverlay();
    new ContactForm();
});