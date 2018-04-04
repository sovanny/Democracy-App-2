var config = {
    apiKey: "AIzaSyAlgtMKytcxjYYTxjIGiDgUEUm5yVOf3X0",
    authDomain: "democracy-app-2.firebaseapp.com",
    databaseURL: "https://democracy-app-2.firebaseio.com",
    projectId: "democracy-app-2",
    storageBucket: "democracy-app-2.appspot.com",
    messagingSenderId: "895134222441"
};
firebase.initializeApp(config);
var database = firebase.database()
var userRef = database.ref("users")
var cardRef = database.ref("cards")


$(document).ready(function(){
    $("#loginBtn").click(function(){
        var id = document.getElementById("id").value;
        var psw = document.getElementById("password").value;
        userRef.once("value")
            .then(function(snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if ((childSnapshot.val().ID == id) && (childSnapshot.val().password == psw)) {
                        localStorage.setItem("currentUser",id);
                        // go to the main page
                        window.location.href = "html/mainPage.html";
                    } else {
                        console.log('failed');
                    }
                })
            })
    });
});