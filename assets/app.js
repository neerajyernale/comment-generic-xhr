const cl = console.log;
const nameControl = document.getElementById('name');
const emailControl = document.getElementById('email');
const bodyControl = document.getElementById('body');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('UpdateBtn');
const form = document.getElementById('commentForm');
const commentContainer = document.getElementById('commentContainer');
const spinner = document.getElementById('spinner');


let commentArr = [];
function snackbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}
let BaseURL = "https://jsonplaceholder.typicode.com";
let post_Url = `${BaseURL}/comments`;

function makeApiCall(methodNAme,api_url,body=null,successCb,errorCb){
    spinner.classList.remove('d-none');
 body = body ? JSON.stringify(body):null

let xhr = new XMLHttpRequest();
xhr.open(methodNAme,api_url);
xhr.send(body);
xhr.onload = function (){
    if(xhr.status>=200 && xhr.status<=299){
        let res = JSON.parse(xhr.response);
        if(methodNAme === 'GET'){
            successCb(res);
        }else if(methodNAme === 'POST'){
            let obj = {...JSON.parse(body),id:res.id};
            successCb(obj);
        }else if(methodNAme === 'PATCH' || methodNAme === 'PUT'){
            successCb(JSON.parse(body));
        }else{
            successCb();
        }
       
    } else{
            errorCb(xhr);
        }
    spinner.classList.add('d-none');

}
xhr.onerror = function (){
    cl("something went wrong");

}

}

function createCard(arr){
    let result = '';
    arr.forEach(ele=>{
        result+=`
        <div class="col-md-4 mb-3 mt-3" id="${ele.id}">
        <div class="card shadow h-100">
        <div class='card-header'>
        <h1>${ele.name}</h1>
        </div>
        <div class="card-body">
         <h2>${ele.email}</h2>
        <p>${ele.body}</p>
      
        
        </div>
        <div class='card-footer d-flex justify-content-between'>
        <button class=' btn btn-outline-primary btn-sm' onClick="onEdit(this)">Edit</button>
        <button class=' btn btn-outline-danger btn-sm' onClick="onRemove(this)">Remove</button>        
        </div>
        
        </div>
        
        </div>
        `
    });
    commentContainer.innerHTML=result;
}
makeApiCall('GET',post_Url,null,createCard,snackbar);


function onCreateCard(ele){
    ele.preventDefault();
    let newObj = {
        name:nameControl.value,
        email:emailControl.value,
        body:bodyControl.value,
      
    }
    makeApiCall('POST',post_Url,newObj,createOnui,snackbar)
}
function createOnui(res){
    let div = document.createElement('div');
    div.className ='col-md-4';
    div.id = res.id
    div.innerHTML=` <div class="card shadow h-100 mt-3">
        <div class='card-header'>
        <h1>${res.name}</h1>
        </div>
        <div class="card-body">
         <h2>${res.email}</h2>
        <p>${res.body}</p>
      
        
        </div>
        <div class='card-footer d-flex justify-content-between'>
        <button class=' btn btn-outline-primary btn-sm' onClick="onEdit(this)">Edit</button>
        <button class=' btn btn-outline-danger btn-sm' onClick="onRemove(this)">Remove</button>        
        </div>
        
        </div>`
        commentContainer.prepend(div);
        form.reset();
         snackbar("Product added Successfully", "success");
}
form.addEventListener('submit',onCreateCard);


function onRemove(ele){
    let removeId = ele.closest('.col-md-4').id;
    localStorage.setItem('removeId',removeId);
Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to undo this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
       if (result.isConfirmed) {
            localStorage.setItem('removeId', removeId);
            let removeUrl = `${BaseURL}/users/removeId}`;
            makeApiCall('DELETE', removeUrl, null, onRemoveFromUi, snackbar);
        }
    });
}
function onRemoveFromUi(){
    let remove_id = localStorage.getItem('removeId');
    document.getElementById(remove_id).remove();
      Swal.fire({
        title: 'Deleted!',
        text: 'Product has been deleted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });

}

function onEdit(ele){
    let editId = ele.closest('.col-md-4').id;
    localStorage.setItem('editId',editId);
    let editUrl = `${BaseURL}/comments/${editId}`;
    makeApiCall('GET',editUrl,null,patchOnui,snackbar)
}
function patchOnui(editObj){
    nameControl.value = editObj.name;
    emailControl.value = editObj.email;
    bodyControl.value = editObj.body;

    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
}


function onUpdate(){
    let updateId = localStorage.getItem('editId');
    let updateObj = {
        
        name:nameControl.value,
        email:emailControl.value,
        body:bodyControl.value,
        id:updateId,
       

    }
    let updateUrl = `${BaseURL}/comments/${updateId}`;
    makeApiCall('PATCH',updateUrl,updateObj,updateOnui,snackbar)
}
function updateOnui(updateObj){
    let card = document.getElementById(updateObj.id);
    card.querySelector('.card-header h1').innerHTML = updateObj.name;
    card.querySelector('.card-body h2').innerHTML = updateObj.email;
    card.querySelector('.card-body p').innerHTML = updateObj.body;


     addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    form.reset();
    snackbar("Product Updated Successfully", "success");
    
}
updateBtn.addEventListener('click',onUpdate);