const btnLogIn = document.querySelector('#logIn');
const form = document.querySelector('#form');
const mesaggeWrong = document.querySelector('#wrongPass');

form.addEventListener('submit', submitEvent);

function submitEvent(event){
    event.preventDefault();
    const userId = document.querySelector('#userId');
    const userPassword = document.querySelector('#userPassword');
    if (userId.value == "demo" && userPassword.value == "1234"){
            location.href = "../Html/cursos.html";
    }else { mesaggeWrong.classList.remove('inactive')};
}