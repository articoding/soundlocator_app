function login(formData) {
    // Enviar la solicitud AJAX
    $.ajax({
        url: loginUser_route,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            console.table(response)
            // Obtener el valor de la cookie
            saveLocalStorageValue("id_user", response.id_User);

            console.log('ID de usuario:', getLocalStorageValue("id_user"));
            loadPartialView("user/profile", appRender);
            loadPartialView("home/navbar_2", navRender)

            getUserData(parseInt(response.id_User));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar cualquier error que ocurra durante la solicitud AJAX
            console.error('Error:', textStatus, errorThrown);
        }
    });        
}

function register(registerData) {
    // Enviar la solicitud AJAX
    $.ajax({
        url: createUser,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(registerData),
        success: function(response) {
            console.table(response)
            // Obtener el valor de la cookie
            let idUser = response.id_User;

            saveLocalStorageValue("id_user", idUser);

            loadPartialView('login', appRender);
  
            getUserData(parseInt(idUser));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar cualquier error que ocurra durante la solicitud AJAX
            console.error('Error:', textStatus, errorThrown);
        }
    });        
}

function logout(){
    removeLocalStorageValue("id_user");
    loadPartialView('login', appRender);
}

function getUserData(id) {
    $.ajax({
        url: getUser_route + id,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            var user = response;
            setUserData(user);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar cualquier error que ocurra durante la solicitud AJAX
            console.error('Error:', textStatus, errorThrown);
        }
    });   
}

function setUserData(User) {
    console.table(User)
    document.querySelector('.Usuario').innerHTML += User.Nickname
    document.querySelector('.Correo').innerHTML += User.Email;
    document.querySelector('.Password').innerHTML += User.Password;
    document.querySelector('.Description').innerHTML += User.Description;
}

function getAllUsers() {
    $.ajax({
        url: allUsers_route,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.table(response)
            users = response;
            let ul = document.querySelector('.user-list');
            ul.innerHTML = "";
            response.forEach(user => {
                loadPartialView('modules/sub_modules/users_option', document.querySelector('.user-list'), true, user, "getAllUsers");
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar cualquier error que ocurra durante la solicitud AJAX
            console.error('Error:', textStatus, errorThrown);
        }
    });   
}

function setUserList(li, user){
    console.log(li);
    li.id = ('user_id_' + user.Id_User);
    li.classList.remove('user_id_');
    li.querySelector('.user-name').innerHTML = user.Name + ' ' + user.Lastname;
    li.querySelector('.user-title').innerHTML = user.Title;
    li.querySelector('.total_jobs').innerHTML = 0;
    li.querySelector('.total_educations').innerHTML = 0;
    li.querySelector('.total_skills').innerHTML = 0;
    li.querySelector('.user-background').classList.add(user.Background);
    cleanPlaceholders('#' + li.id);
    document.querySelector('#' + li.id).addEventListener('click', function () {
        loadPartialView('user/user_profile', appRender);
        getUserData(parseInt(this.id.split('_')[2]));
    });
}

function getTotalUsers() {
    $.ajax({
        url: totalUser_route,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.table(response)
            document.querySelector('.total_users').innerText = response; 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar cualquier error que ocurra durante la solicitud AJAX
            console.error('Error:', textStatus, errorThrown);
        }
    });   
}

function loadUserData() {
    user_profile = document.querySelector('.user-profile');
    loadModules(moduleProfileData, user_profile, true);
    loadModules(moduleJobsData, user_profile, true);
    loadModules(moduleEducationalsData, user_profile, true);
    loadModules(moduleSkillsData, user_profile, true);
}