window.onload = initialize;

const CREATE = "Terminar formulario";
const UPDATE = "Actualizar formulario";

var buttonMode = CREATE;

var refFormEntryEdit;

var educativeCenterImage;

var storageRef;

var imageUrl;

function initialize() {

    checkIfUserIsLoggedIn();

    var signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", logout);

    var formSchools = document.getElementById("form-schools");

    formSchools.addEventListener("submit", validateFormSchools);

    tbodySchoolsTable = document.getElementById("tbody-table-schools-data");

    educativeCenterImage = document.getElementById("educative-center-image");

    storageRef = firebase.storage().ref();

    document.getElementById("edit-message").style.display = "none";
}

function checkIfUserIsLoggedIn() {

    var showEmail = document.getElementById("user-email");

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("User is signed in.")
            console.log(user.email);

            showEmail.innerHTML = user.email;

            document.getElementById("register").style.display = "none";
            document.getElementById("sign-in").style.display = "none";
            document.getElementById("user-email").style.display = "block";
            document.getElementById("sign-out").style.display = "block";

            if (user.email == "admin@admin.com") {
                showSchoolsDataFromFirebaseAdmin();
            } else {
                showSchoolsDataFromFirebaseUser();
            }

        } else {
            console.log("No user is signed in.")

            document.getElementById("register").style.display = "block";
            document.getElementById("sign-in").style.display = "block";
            document.getElementById("user-email").style.display = "none";
            document.getElementById("sign-out").style.display = "none";
            showSchoolsDataFromFirebaseNormal()
        }
    })
}

function logout() {
    location.reload();

    console.log("Hola")
    firebase.auth().signOut().then(() => {
        console.log("User logged out")
    }).catch((error) => {
        console.log(error.message)
    });

}

function validateFormSchools(event) {

    event.preventDefault();

    var formSchools = event.target;

    var error = false;

    var educativeCenterName = formSchools["educative-center-name"].value;
    if (!educativeCenterName) {
        error = true;
        document.getElementById("error-educative-center-name").style.display = "block";
    } else {
        document.getElementById("error-educative-center-name").style.display = "none";
    }

    var educativeCenterAddress = formSchools["educative-center-address"].value;
    if (!educativeCenterAddress) {
        error = true;
        document.getElementById("error-educative-center-address").style.display = "block";
    } else {
        document.getElementById("error-educative-center-address").style.display = "none";
    }

    var educativeCenterPhone = formSchools["educative-center-phone"].value;
    if (!educativeCenterPhone) {
        error = true;
        document.getElementById("error-educative-center-phone").style.display = "block";
    } else {
        document.getElementById("error-educative-center-phone").style.display = "none";
    }

    var educativeCenterImage = formSchools["educative-center-image"].value;
    if (!educativeCenterImage) {
        error = true;
        document.getElementById("error-educative-center-image").style.display = "block";
    } else {
        document.getElementById("error-educative-center-image").style.display = "none";
    }

    if (!error) uploadImage();

}

function pushSchoolsData(formSchools, imageName, downloadURL) {

    var refSchools = firebase.database().ref().child("centrosEducativos");    
    
    switch (buttonMode) {
        case CREATE:
            refSchools.push({
                Nombre: formSchools["educative-center-name"].value,
                Direccion: formSchools["educative-center-address"].value,
                Tlfno: formSchools["educative-center-phone"].value,
                NombreImagen: imageName,
                UrlImagen: downloadURL
            });
            break;

        case UPDATE:
            refFormEntryEdit.update({
                Nombre: formSchools["educative-center-name"].value,
                Direccion: formSchools["educative-center-address"].value,
                Tlfno: formSchools["educative-center-phone"].value,
                NombreImagen: imageName,
                UrlImagen: downloadURL
            });

            document.getElementById("edit-message").style.display = "none";

            document.getElementById("send-button-schools").value = CREATE;
            buttonMode = CREATE;

            break;
    }

    formSchools.reset();

}

function showSchoolsDataFromFirebaseAdmin() {
    var refSchools = firebase.database().ref().child("centrosEducativos");

    refSchools.on("value", function (snap) {
        var data = snap.val();
        var rowsToShow = "";

        for (var key in data) {
            rowsToShow += "<tr>" +
                "<td>" +
                data[key].Nombre +
                "</td>" +
                "<td>" +
                data[key].Direccion +
                "</td>" +
                "<td>" +
                data[key].Tlfno +
                "</td>" +
                "<td>" +
                "<img src='" + data[key].UrlImagen + "' alt='centerImage' class='img-fluid' style='width: 60px;'></img>" +
                "</td>" +
                "<td><button class='btn btn-secondary edit' form-data='" + key + "' id='edit-button'><img src='img/pencil.png' alt='pencil' class='img-fluid' style='width: 20px;'></img></button></td>" +
                "<td><button class='btn btn-danger delete' form-data='" + key + "'><img src='img/PaperBin.png' alt='paperBin' class='img-fluid' style='width: 20px;'></img></button></td>" +
                "</tr>";
        }

        tbodySchoolsTable.innerHTML = rowsToShow;

        if (rowsToShow != "") {
            var elementsToEdit = document.getElementsByClassName("edit");

            for (var i = 0; i < elementsToEdit.length; i++) {
                elementsToEdit[i].addEventListener("click", editFormEntry, false);
            }

            var elementsToDelete = document.getElementsByClassName("delete");

            for (var i = 0; i < elementsToDelete.length; i++) {
                elementsToDelete[i].addEventListener("click", deleteFormEntry, false);
            }
        }
    });
}

function showSchoolsDataFromFirebaseNormal() {
    var refSchools = firebase.database().ref().child("centrosEducativos");

    refSchools.on("value", function (snap) {
        var data = snap.val();
        var rowsToShow = "";

        for (var key in data) {
            rowsToShow += "<tr>" +
                "<td>" +
                data[key].Nombre +
                "</td>" +
                "<td>" +
                data[key].Direccion +
                "</td>" +
                "<td>" +
                data[key].Tlfno +
                "</td>" +
                "<td>" +
                "<img src='" + data[key].UrlImagen + "' alt='centerImage' class='img-fluid' style='width: 60px;'></img>" +
                "</td>" +
            "</tr>";
        }

        tbodySchoolsTable.innerHTML = rowsToShow;

        if (rowsToShow != "") {
            var elementsToEdit = document.getElementsByClassName("edit");

            for (var i = 0; i < elementsToEdit.length; i++) {
                elementsToEdit[i].addEventListener("click", editFormEntry, false);
            }

            var elementsToDelete = document.getElementsByClassName("delete");

            for (var i = 0; i < elementsToDelete.length; i++) {
                elementsToDelete[i].addEventListener("click", deleteFormEntry, false);
            }
        }
    });
}

function showSchoolsDataFromFirebaseUser() {
    var refSchools = firebase.database().ref().child("centrosEducativos");

    refSchools.on("value", function (snap) {
        var data = snap.val();
        var rowsToShow = "";

        for (var key in data) {
            rowsToShow += "<tr>" +
                "<td>" +
                data[key].Nombre +
                "</td>" +
                "<td>" +
                data[key].Direccion +
                "</td>" +
                "<td>" +
                data[key].Tlfno +
                "</td>" +
                "<td>" +
                "<img src='" + data[key].UrlImagen + "' alt='centerImage' class='img-fluid' style='width: 60px;'></img>" +
                "</td>" +
                "<td><button class='btn btn-secondary edit' form-data='" + key + "' id='edit-button'><img src='img/pencil.png' alt='pencil' class='img-fluid' style='width: 20px;'></img></button></td>" +
            "</tr>";
        }

        tbodySchoolsTable.innerHTML = rowsToShow;

        if (rowsToShow != "") {
            var elementsToEdit = document.getElementsByClassName("edit");

            for (var i = 0; i < elementsToEdit.length; i++) {
                elementsToEdit[i].addEventListener("click", editFormEntry, false);
            }

            var elementsToDelete = document.getElementsByClassName("delete");

            for (var i = 0; i < elementsToDelete.length; i++) {
                elementsToDelete[i].addEventListener("click", deleteFormEntry, false);
            }
        }
    });
}

function deleteFormEntry() {
    var refSchools = firebase.database().ref().child("centrosEducativos");

    var formEntryKeyDelete = this.getAttribute("form-data");
    var refFormEntryDelete = refSchools.child(formEntryKeyDelete);

    refFormEntryDelete.remove();
    
}

function editFormEntry() {
    var refSchools = firebase.database().ref().child("centrosEducativos");

    var formEntryKeyEdit = this.getAttribute("form-data");
    refFormEntryEdit = refSchools.child(formEntryKeyEdit);
    refFormEntryEdit.once("value", function (snap) {
        var data = snap.val();
        document.getElementById("educative-center-name").value = data.Nombre;
        document.getElementById("educative-center-address").value = data.Direccion;
        document.getElementById("educative-center-phone").value = data.Tlfno;
    });

    document.getElementById("edit-message").style.display = "block";

    document.getElementById("send-button-schools").value = UPDATE;
    buttonMode = UPDATE;
}

function uploadImage() {

    var formSchools = document.getElementById("form-schools");

    var uploadImage = educativeCenterImage.files[0];
    var imageName = uploadImage.name;
    var uploadTask = storageRef.child("images/" + imageName).put(uploadImage);

    uploadTask.on("state_changed", function (snapshot) {

    }, function (error) {
        console.log(error);
    }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("File available at", downloadURL);
            pushSchoolsData(formSchools, imageName, downloadURL);
        });
    });

}
