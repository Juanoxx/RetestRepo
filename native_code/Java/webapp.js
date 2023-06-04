const btnCreate = document.querySelector('#createTest');
const btnCancel = document.querySelector('#cancel');
const btnUpload = document.querySelector('#upload');



btnCreate.addEventListener('click', createNewTest);
btnCancel.addEventListener('click', turnoffForm);
btnUpload.addEventListener('click', turnoffForm);

function createNewTest(){
    formNewTest.classList.remove('inactive')
    banish.classList.remove('inactive')

};

function turnoffForm(){
    formNewTest.classList.add('inactive')
    banish.classList.add('inactive')

};






function submitEvent(event){
    event.preventDefault();
    const userId = document.querySelector('#userId');
    const userPassword = document.querySelector('#userPassword');
    if (userId.value == "demo" && userPassword.value == "1234"){
            location.href = "../Html/evaluaciones.html";
    }else { mesaggeWrong.classList.remove('inactive')};
}