window.onload = initialize;

function initialize() {

    checkIfUserIsLoggedIn();

    var signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", logout);


    var refObesity = firebase.database().ref().child("obesity");

    var tbodyObesityTableComplete = document.getElementById("tbody-table-personal-data-complete");

    refObesity.on("value", function (snap) {
        var data = snap.val();
        var rowsToShow = "";
        for (var key in data) {
            rowsToShow += "<tr>" +
                "<td>" +
                data[key].educativeCenter +
                "</td>" +
                "<td>" +
                data[key].registerDate +
                "</td>" +
                "<td>" +
                data[key].studentClass +
                "</td>" +
                "<td>" +
                data[key].sex +
                "</td>" +
                "<td>" +
                data[key].age +
                "</td>" +
                "<td>" +
                data[key].weight + " kg" +
                "</td>" +
                "<td>" +
                data[key].bmi +
                "</td>" +
                "<td>" +
                data[key].fatPercentage +
                "</td>" +
                "<td>" +
                data[key].muscleWeight +
                "</td>" +
                "<td>" +
                data[key].muscleMassLevel +
                "</td>" +
                "<td>" +
                data[key].boneWeight +
                "</td>" +
                "<td>" +
                data[key].kilocalories +
                "</td>" +
                "<td>" +
                data[key].methabolicAge +
                "</td>" +
                "<td>" +
                data[key].height + " cm" +
                "</td>" +
                "<td>" +
                data[key].absPerimeter +
                "</td>" +
                "<td>" +
                data[key].activity + " días a la semana" +
                "</td>" +
                "</tr>";
        }

        tbodyObesityTableComplete.innerHTML = rowsToShow;

    });

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

        } else {
            console.log("No user is signed in.")

            document.getElementById("register").style.display = "block";
            document.getElementById("sign-in").style.display = "block";
            document.getElementById("user-email").style.display = "none";
            document.getElementById("sign-out").style.display = "none";
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
