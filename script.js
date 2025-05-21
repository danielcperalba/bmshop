document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap tooltips and popovers
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    // Intersection Observer for animations
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });

    // Add animation classes
    document.querySelectorAll('.card, .hero-badges .badge')
        .forEach(el => {
            el.classList.add('animate-on-scroll');
            animateOnScroll.observe(el);
        });

    // Number animation for stats
    const animateNumber = (element) => {
        const target = parseInt(element.textContent.replace(/,/g, ''));
        const duration = 2000;
        const steps = 50;
        const stepValue = target / steps;
        let current = 0;
        
        const updateNumber = () => {
            current += stepValue;
            if (current > target) current = target;
            
            element.textContent = Math.floor(current).toLocaleString();
            
            if (current < target) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        updateNumber();
    };

    // Form handling with Bootstrap validation
    const registerForm = document.getElementById('registerForm');
    const inputs = registerForm.querySelectorAll('input');

    const validateInput = (input) => {
        const value = input.value.trim();
        let isValid = true;
        let message = '';
        
        switch(input.id) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = 'Por favor, insira um e-mail válido';
                break;
            
            case 'phone':
                isValid = value.length >= 14;
                message = 'Por favor, insira um telefone válido';
                break;
            
            case 'cnpj':
                isValid = value.length >= 18;
                message = 'Por favor, insira um CNPJ válido';
                break;
            
            default:
                isValid = value.length > 0;
                message = 'Este campo é obrigatório';
        }

        const formGroup = input.closest('.mb-3');
        const feedback = formGroup.querySelector('.invalid-feedback') || document.createElement('div');
        feedback.className = 'invalid-feedback';
        
        if (!isValid && value.length > 0) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = message;
            if (!formGroup.querySelector('.invalid-feedback')) {
                formGroup.appendChild(feedback);
            }
        } else if (value.length > 0) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (formGroup.contains(feedback)) {
                formGroup.removeChild(feedback);
            }
        }

        return isValid;
    };

    // Input masks
    const masks = {
        phone: (value) => {
            return value
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d)(\d{4})$/, '$1-$2')
                .slice(0, 15);
        },
        cnpj: (value) => {
            return value
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/g, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/g, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/g, '.$1/$2')
                .replace(/(\d{4})(\d)/g, '$1-$2')
                .slice(0, 18);
        }
    };

    // Apply input masks and validation
    inputs.forEach(input => {
        const mask = masks[input.id];
        
        if (mask) {
            input.addEventListener('input', (e) => {
                input.value = mask(input.value);
            });
        }

        input.addEventListener('blur', () => validateInput(input));
        
        // Add focus effects
        input.addEventListener('focus', () => {
            input.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('focused');
        });
    });

    // Form submission with Bootstrap validation
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalContent = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message with Bootstrap alert
            const formCard = registerForm.closest('.card-body');
            formCard.innerHTML = `
                <div class="success-message text-center">
                    <i class="fas fa-check-circle text-success display-1 mb-4"></i>
                    <h3 class="h4 mb-3">Cadastro realizado com sucesso!</h3>
                    <p class="text-muted">Em breve entraremos em contato.</p>
                </div>
            `;
        } catch (error) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalContent;
            
            // Show error message with Bootstrap alert
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
            alertDiv.innerHTML = `
                <strong>Erro!</strong> Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            registerForm.insertAdjacentElement('beforebegin', alertDiv);
        }
    });

    // Bootstrap smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('h3');
        
        header.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}); 