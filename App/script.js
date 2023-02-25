// Botões
const heroSignInButton = document.getElementById('heroSignInButton');
const signInVoltarButton = document.getElementById('signInVoltarButton');
const planosSignUpButton = document.getElementById('planosSignUpButton');
const signUpVoltarButton = document.getElementById('signUpVoltarButton');

// Seções
const heroSection = document.getElementById('hero');
const comoFuncionaSection = document.getElementById('como-funciona');
const planosSection = document.getElementById('planos');
const signInSection = document.getElementById('sign-in');
const checkoutSection = document.getElementById('checkout');
const dashboardSection = document.getElementById('dashboard');

// Funções
signInSection.hidden = true;
checkoutSection.hidden = true;
dashboardSection.hidden = true;
const showHideMainContent = (show) => {
    heroSection.hidden = show;
    comoFuncionaSection.hidden = show;
    planosSection.hidden = show;
}
const bringToTop = () => {
    window.scrollTo(0, 0);
    window.location.href='#'
}

// Eventos
heroSignInButton.addEventListener('click', () => {
    showHideMainContent(true);
    signInSection.hidden = false;
    bringToTop()
})

signInVoltarButton.addEventListener('click', () => {
    showHideMainContent(false);
    signInSection.hidden = true;
    bringToTop()
})

planosSignUpButton.addEventListener('click', () => {
    bringToTop()
    checkoutSection.hidden = false
    showHideMainContent(true);
})

signUpVoltarButton.addEventListener('click', () => {
    bringToTop()
    showHideMainContent(false)
    checkoutSection.hidden = true;
})