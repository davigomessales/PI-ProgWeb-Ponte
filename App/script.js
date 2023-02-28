// Botões
const heroSignInButton = document.getElementById('heroSignInButton');
const heroLateralSignInButton = document.getElementById('heroLateralSignInButton');
const signInVoltarButton = document.getElementById('signInVoltarButton');
const planosSignUpFreeButton = document.getElementById('planosSignUpFreeButton');
const planosSignUpPremiumButton = document.getElementById('planosSignUpPremiumButton');
const signUpVoltarButton = document.getElementById('signUpVoltarButton');
let signOutButton;

// Seções
const heroSection = document.getElementById('hero');
const comoFuncionaSection = document.getElementById('como-funciona');
const planosSection = document.getElementById('planos');
const signInSection = document.getElementById('sign-in');
const checkoutSection = document.getElementById('checkout');
const dashboardSection = document.getElementById('dashboard');
const paymentSection = document.getElementById('payment');
const menuLoginSignUpSection = document.getElementById('menu-login-sign-up');
const menuLoggedSection = document.getElementById('menuLoggedSection');
const forms = document.querySelectorAll('.needs-validation')
let tableDepositos = document.querySelector('#dashboardTableDepositos');
let tableResiduos = document.querySelector('#dashboardTableResiduos');

//Campos Checkout
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const address = document.getElementById('address');
const address2 = document.getElementById('address2');
const country = document.getElementById('country');
const state = document.getElementById('state');
const zip = document.getElementById('zip');

//Campos Login
const emailSignIn = document.getElementById('floatingInput');
const passwordSignIn = document.getElementById('floatingPassword');

// Funções
signInSection.hidden = true;
checkoutSection.hidden = true;
dashboardSection.hidden = true;
menuLoginSignUpSection.hidden = false
let idTipoAssinatura = null;
let pessoa = {
    
}
let pontuacaoAtual = 0;
let planoAtual = '';
let planosList = []
let residuosList = [];
let depositosList = [];
const urlBase = 'http://localhost:3000';


const showMainContent = (show) => {
    heroSection.hidden = show;
    comoFuncionaSection.hidden = show;
    planosSection.hidden = show;
}

const showLogged = (isShow) => {
    if (isShow) {
        menuLoggedSection.innerHTML = `<div class="flex-shrink-0 dropdown">
        <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://avatars.githubusercontent.com/davigomessales" alt="mdo" width="32" height="32" class="rounded-circle">
        </a>
        <ul class="dropdown-menu text-small shadow" style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate(0px, 34px);">
          <li><a class="dropdown-item" href="#" id="signOutButton">Sair</a></li>
        </ul>
      </div>`
      signOutButton = document.getElementById('signOutButton')
      signOutButton.addEventListener('click', () => {
        bringToTop()
        showLogged(false)
        showMainContent(false);
        tableResiduos.innerHTML = ''
        tableDepositos.innerHTML = ''
        table.innerHTML = ''
        dashboardSection.hidden = true;
    })
      menuLoginSignUpSection.hidden = isShow;
    } else {
        menuLoggedSection.innerHTML = ''
        menuLoginSignUpSection.hidden = !isShow;
    }
}

const bringToTop = () => {
    window.scrollTo(0, 0);
    window.location.href = '#'
}

const clearSignUpFields = () => {
    firstName.value = '';
    lastName.value = '';
    username.value = '';
    email.value = '';
    password.value = '';
    address.value = '';
    address2.value = '';
    country.value = '';
    state.value = '';
    zip.value = '';
    idTipoAssinatura = null;
    planosList = []
    residuosList = [];
    depositosList = [];
}
planosList
const addFreeItemCart = () => {
    document.getElementsByClassName('list-group')[0].innerHTML = `<li class="list-group-item d-flex justify-content-between lh-sm">
    <div>
      <h6 class="my-0">Free</h6>
      <small class="text-muted">Assinatura Gratuita</small>
    </div>
    <span class="text-muted">R$0</span>
  </li>
  <li class="list-group-item d-flex justify-content-between">
  <span>Total (Reais)</span>
  <strong>R$0</strong>
</li>`
}

const addPremiumItemCart = () => {
    document.getElementsByClassName('list-group')[0].innerHTML = `<li class="list-group-item d-flex justify-content-between lh-sm">
    <div>
      <h6 class="my-0">Premium</h6>
      <small class="text-muted">Assinatura Paga</small>
    </div>
    <span class="text-muted">R$9,90</span>
  </li>
  <li class="list-group-item d-flex justify-content-between">
  <span>Total (Reais)</span>
  <strong>R$9,90</strong>
</li>`
}

const getPersonalInfo = () => {
   getPontuacao()
}

const getPontuacao = () => {
    let peso = 0;
    let pesoPorResiduo = [];
    console.log(residuosList)
    if (planosList.length > 0){
        planoAtual = planosList.filter(plano => pessoa.idTipoAssinatura === plano.id)
    }
    if (depositosList.length > 0) {
        pesoPorResiduo = depositosList.map(deposito => {
            return (deposito.peso/1000) * residuosList[deposito.idResiduo - 1].pontosPorQuilo
        })
    }
    if (pesoPorResiduo.length > 0) {
        pesoPorResiduo.forEach(el => {
            peso = peso + el
        })
        pontuacaoAtual = peso * planoAtual[0].fatorPlano
    }
    if (pessoa && pontuacaoAtual && planoAtual){
        document.getElementById('greeting').innerHTML = `Olá ${pessoa.firstName.toUpperCase()}`
        document.getElementById('pontuacaoAtual').innerHTML = `Sua pontuação atual é de: ${pontuacaoAtual}`
        document.getElementById('planoAtual').innerHTML = `Sua assinatura é: ${planoAtual[0].nome.toUpperCase()}`
    }
}

const sendData = (event) => {
    if (event.target.id === "sign-up-form"){
        sendDataSignUp();
    } else if (event.target.id === "sign-in-form") {
        sendDataLogin()
    }
}

const sendDataLogin = () => {
    let isOk = true;
    const data = {
        email: emailSignIn.value,
        password: passwordSignIn.value,
    }
    fetch(urlBase + '/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
    }).then((res) => {
        isOk = res.ok
        return res.json()
    }).then((json) => {
        if (isOk) {
            showLogged(true)
            bringToTop()
            clearSignUpFields()
            showMainContent(true)
            checkoutSection.hidden = true;
            signInSection.hidden = true;
            dashboardSection.hidden = false;
            pessoa = json.user;
            getResiduos();
            getPlanos();
            getDepositos();
            
        } else {
            showLogged(false)
            alert(`Erro: ${json}`)
        }
    })
    resetForm('sign-in-form');
}

const sendDataSignUp = () => {
    let isOk = true;
    const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
        email: email.value,
        password: password.value,
        address: address.value,
        address2: address2.value,
        country: country.value,
        state: state.value,
        zip: zip.value,
        idTipoAssinatura: idTipoAssinatura,
    }
    fetch(urlBase + '/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
    }).then((res) => {
        isOk = res.ok;
        return res.json()
    }).then((json) => {
        if (isOk) {
            bringToTop()
            clearSignUpFields()
            showMainContent(false)
            checkoutSection.hidden = true;
        } else {
            alert(json)
        }
    })
    resetForm('sign-up-form');
}

const resetForm = (idForm) => {
    document.getElementById(idForm).classList.remove('was-validated')
    document.getElementById(idForm).reset()
}

const getPlanos = () => {
    fetch(urlBase + '/planos', {
        method: 'GET',
    }).then((res) => {
        isOk = res.ok;
        return res.json()
    }).then((json) => {
        if (isOk) {
            if(json.length > 0) {
                planosList = json;
                // generateTable(tableDepositos, json)
                // generateTableHead(tableDepositos, json)
            }
        } else {
            alert(json)
        }
    })
}
const getDepositos = () => {
    fetch(urlBase + '/depositos', {
        method: 'GET',
    }).then((res) => {
        isOk = res.ok;
        return res.json()
    }).then((json) => {
        if (isOk) {
            if(json.length > 0) {
                const data = []
                json.filter(deposito => {
                    if (deposito.idUser === pessoa.id){
                        data.push(deposito)
                    }
                })
                depositosList = data;
                getPersonalInfo()
                generateTable(tableDepositos, data)
                generateTableHead(tableDepositos, data)
            }
        } else {
            alert(json)
        }
    })
}

const getResiduos = () => {
    fetch(urlBase + '/residuos', {
        method: 'GET',
    }).then((res) => {
        isOk = res.ok;
        return res.json()
    }).then((json) => {
        if (isOk) {
            if(json.length > 0) {
                residuosList = json
                generateTable(tableResiduos, json)
                generateTableHead(tableResiduos, json)
            }
        } else {
            alert(json)
        }
    })
}

const generateTableHead = (table, values) => {
    let data = Object.keys(values[0])
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        if (key !== 'id' && key !== 'idUser') {
            let th = document.createElement('th');
            th.scope = "col"
            let text = document.createTextNode(key);
            th.appendChild(text)
            row.appendChild(th);
        }
    }
}
const generateTable = (table, data) => {
    for (let element of data){
        let row = table.insertRow()
        for(key in element){
            if (key !== 'id' && key !== 'idUser') {
                let cell = row.insertCell()
                if (key === 'idResiduo'){
                    let text = document.createTextNode(residuosList[element[key] - 1].nomeResiduo)
                    cell.appendChild(text);
                } else {
                    let text = document.createTextNode(element[key])
                    cell.appendChild(text);
                }
            }
        }
    }
}

// Eventos
heroSignInButton.addEventListener('click', () => {
    resetForm('sign-in-form');
    bringToTop()
    showMainContent(true);
    signInSection.hidden = false;
})

heroLateralSignInButton.addEventListener('click', () => {
    resetForm('sign-in-form');
    bringToTop()
    showMainContent(true);
    signInSection.hidden = false;
    checkoutSection.hidden = true;
    resetForm('sign-up-form');
})

signInVoltarButton.addEventListener('click', () => {
    bringToTop()
    showMainContent(false);
    resetForm('sign-in-form');
    signInSection.hidden = true;
})

planosSignUpFreeButton.addEventListener('click', () => {
    bringToTop()
    resetForm('sign-up-form');
    checkoutSection.hidden = false
    paymentSection.innerHTML = ''
    showMainContent(true);
    addFreeItemCart();
    idTipoAssinatura = 1;
})

planosSignUpPremiumButton.addEventListener('click', () => {
    bringToTop()
    resetForm('sign-up-form');
    checkoutSection.hidden = false
    const paymentNode = document.createElement('div')
    paymentSection.innerHTML = `<div class="form-check">
      <input type="checkbox" class="form-check-input" id="same-address">
      <label class="form-check-label" for="same-address">Shipping address is the same as my billing
        address</label>
    </div>

    <div class="form-check">
      <input type="checkbox" class="form-check-input" id="save-info">
      <label class="form-check-label" for="save-info">Save this information for next time</label>
    </div>

    <hr class="my-4">

    <h4 class="mb-3">Payment</h4>

    <div class="my-3">
      <div class="form-check">
        <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required>
        <label class="form-check-label" for="credit">Credit card</label>
      </div>
      <div class="form-check">
        <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required>
        <label class="form-check-label" for="debit">Debit card</label>
      </div>
      <div class="form-check">
        <input id="paypal" name="paymentMethod" type="radio" class="form-check-input" required>
        <label class="form-check-label" for="paypal">PayPal</label>
      </div>
    </div>

    <div class="row gy-3">
      <div class="col-md-6">
        <label for="cc-name" class="form-label">Name on card</label>
        <input type="text" class="form-control" id="cc-name" placeholder="" required>
        <small class="text-muted">Full name as displayed on card</small>
        <div class="invalid-feedback">
          Name on card is required
        </div>
      </div>

      <div class="col-md-6">
        <label for="cc-number" class="form-label">Credit card number</label>
        <input type="text" class="form-control" id="cc-number" placeholder="" required>
        <div class="invalid-feedback">
          Credit card number is required
        </div>
      </div>

      <div class="col-md-3">
        <label for="cc-expiration" class="form-label">Expiration</label>
        <input type="text" class="form-control" id="cc-expiration" placeholder="" required>
        <div class="invalid-feedback">
          Expiration date required
        </div>
      </div>

      <div class="col-md-3">
        <label for="cc-cvv" class="form-label">CVV</label>
        <input type="text" class="form-control" id="cc-cvv" placeholder="" required>
        <div class="invalid-feedback">
          Security code required
        </div>
      </div>
    </div>

    <hr class="my-4">`
    showMainContent(true);
    addPremiumItemCart();
    idTipoAssinatura = 2;
})

signUpVoltarButton.addEventListener('click', () => {
    bringToTop()
    showMainContent(false)
    checkoutSection.hidden = true;
    resetForm('sign-up-form');
})

Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            sendData(event)
        }
        form.classList.add('was-validated')
        }, false)
})

