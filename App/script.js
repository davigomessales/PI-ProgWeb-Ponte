const main = document.querySelector('#main');
const sign = document.querySelector('#sign');
const signUp = document.querySelector('#signUp');
const signButton = document.querySelector('#signButton');
const signUpButton = document.querySelector('#signUpButton');
const accessMain = document.querySelector('#accessMain');
const accessSide = document.querySelector('#accessSide');
const cancelButton = document.querySelector('#cancelButton');
const signUpCancelButton = document.querySelector('#signUpCancelButton');
const loginButtons = document.querySelector('#loginButtons');
const logged = document.querySelector('#logged');
const dashboard = document.querySelector('#dashboard');
const emailSignIn = document.querySelector('#floatingInput')
const passwordSignIn = document.querySelector('#floatingPassword')
// Sign Up
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const username = document.getElementById('username')
const email = document.getElementById('email')
const address = document.getElementById('address')
const password = document.getElementById('password')
const address2 = document.getElementById('address2')
const country = document.getElementById('country')
const state = document.getElementById('state')
const zipcode = document.getElementById('zip')
const isSameAddress = document.getElementById('same-address')
const isSaveInfo = document.getElementById('save-info')
const signUpCadastrar = document.querySelector('#signUpCadastrar');
const signOutButton = document.querySelector('#signOutButton');
const pontuacaoValor = document.querySelector('#pontuacaoValor');
let idUsuario;
let user;
let depositosList;
let depositosListFromUser;
let residuosList;

const urlBase = 'http://localhost:3000'


sign.hidden = true
signUp.hidden = true
main.hidden = false
logged.hidden = true
dashboard.hidden = true

const onClickSign = () => {
    main.hidden = true
    signUp.hidden = true
    sign.hidden = false
}
const onClickCancelSign = () => {
    sign.hidden = true
    main.hidden = false
    signUp.hidden = true
    clearFields()
}
const onClickSignUp = () => {
    main.hidden = true
    sign.hidden = true
    signUp.hidden = false
}

signUpCadastrar.addEventListener('click', () => {
    sign.hidden = true
    main.hidden = false
    signUp.hidden = true
    register({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        address2: address2.value,
        country: country.value,
        state: state.value,
        zipcode: zipcode.value,
    })
})

signOutButton.addEventListener('click', () => {
    loginButtons.hidden = false
    logged.hidden = true
    dashboard.hidden = true
    main.hidden = false
    idUsuario = null;
})

signButton.addEventListener('click', () => {
    login({
        email: emailSignIn.value,
        password: passwordSignIn.value
    })
})
accessMain.addEventListener('click', onClickSign)
accessSide.addEventListener('click', onClickSign)
signUpButton.addEventListener('click', onClickSignUp)
signUpCancelButton.addEventListener('click', () => {
    sign.hidden = true
    main.hidden = false
    signUp.hidden = true
})
cancelButton.addEventListener('click', onClickCancelSign)

const clearFields = () => {
    email.value = ''
    password.value = ''
    firstName.value = ''
    lastName.value = ''
    address.value = ''
    address2.value = ''
    country.value = ''
    state.value = ''
    zipcode.value = ''
}
const register = (personData) => {
    fetch(urlBase + '/users', {
        method: 'POST',
        body: JSON.stringify({
            email: personData.email,
            password: personData.password,
            firstName: personData.firstName,
            lastName: personData.lastName,
            lastName: personData.lastName,
            address: personData.address,
            address2: personData.address2,
            country: personData.country,
            state: personData.state,
            zipcode: personData.zipcode,
            plano: ''
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
    })
    .then((res) => {
        clearFields()
        return res.json()
    })
    .then((json) => {
         console.log(json)
    })
}
const login = (personData) => {
    fetch(urlBase + '/login', {
        method: 'POST',
        body: JSON.stringify({
            email: personData.email,
            password: personData.password,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
    })
    .then((res) => {
        return res.json()
    })
    .then((json) => {
        idUsuario = json.user.id
         loginButtons.hidden = true
         main.hidden = true
         sign.hidden = true
         signUp.hidden = true
         logged.hidden = false
         dashboard.hidden = false
         clearFields()
         getUser()
         console.log(main)
         
    })
}
const greetUser = (user) => {
    document.getElementById("greetUser").innerHTML = `Olá, ${user.firstName}`
}
const getUsers = () => {
    fetch(urlBase + '/users')
    .then((res) => res.json())
    .then((json) => {
        console.log(json)
    })
}

const getUser = () => {
    fetch(urlBase + `/users/${idUsuario}`)
    .then((res) => res.json())
    .then((user) => {
        getDepositos(user)
        getResiduos()
        greetUser(user)
        getScore(user)
    })
}

const getScore = (score) => {
    pontuacaoValor.innerHTML = score + ' pontos'
}

const changeScore = (score) => {
    fetch(urlBase + `/users/${idUsuario}`, {
        method: 'PATCH',
        body: JSON.stringify({
            score: score,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
    })
    .then((res) => {
        return res.json()
    })
    .then((json) => {
        console.log('changeScore', json) 
    })
}

let tableDepositos = document.querySelector('#dashboardTableDepositos');
let tableResiduos = document.querySelector('#dashboardTableResiduos');
const getResiduos = () => {
    fetch(urlBase + `/residuos`, {
        method: 'GET',
    })
    .then((res) => {
        console.log('res', res)
        if(res.ok){
        }
        return res.json()
    })
    .then((json) => {
        residuosList = json
        calculaPontuacao(depositosListFromUser, residuosList)
        generateTable(tableResiduos, json)
        generateTableHead(tableResiduos, json)
    })
}

const getDepositos = (user) => {
    fetch(urlBase + `/depositos`, {
        method: 'GET',
    })
    .then((res) => {
        if(res.ok){
        }
        return res.json()
    })
    .then((json) => {
        depositosList = json
        getDepositosFromUser(user, json)
    })
}

const getDepositosFromUser = (user) => {
    const data = depositosList.filter(element => {
        if (element.idUser === user.id){
            return element
        }
    })
    depositosListFromUser = data;
    generateTable(tableDepositos, data)
    generateTableHead(tableDepositos, data)
}


const calculaPontuacao = (data, residuosList) => {
    let scoreTotal = 0
    data.forEach(element => {
        let residuoPontuacao = residuosList.find(({id}) => id === element.idResiduo).pontuacao;
        scoreTotal = scoreTotal + (element.peso * residuoPontuacao)
    });
    changeScore(scoreTotal)
    getScore(scoreTotal)
}

const getFatorPlano = () => {

}

const generateTableHead = (table, values) => {
    let data = Object.keys(values[0])
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement('th');
        th.scope = "col"
        let text = document.createTextNode(key);
        th.appendChild(text)
        row.appendChild(th);
    }
}
const generateTable = (table, data) => {
    for (let element of data){
        let row = table.insertRow()
        for(key in element){
            let cell = row.insertCell()
            let text = document.createTextNode(element[key])
            cell.appendChild(text);
        }
    }
}