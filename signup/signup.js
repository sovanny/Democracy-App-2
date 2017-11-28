//firebase();
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

    allCardUids = [];
    cardRef.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                card = childSnapshot.val();
                allCardUids.push(card.UID);
            })});

    allUserIDs = [];
    userRef.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                user = childSnapshot.val();
                allUserIDs.push(user.ID);
            })});


    $("#signupBtn").click(function(){


        id = document.getElementById("id").value;
        pwd1 = document.getElementById("password1").value;
        pwd2 = document.getElementById("password2").value;

        if(allUserIDs.indexOf(id) > -1){
            var x = document.getElementById("snackbar");
            x.innerHTML ="USername aldready exists";
            x.className = "show";

            $('#id').empty();

            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
        else if(pwd1 == pwd2 && pwd1 != ""){
            //ad new user to db
            userRef.push({
                ID: id,
                password: pwd1,
                feed_uids: allCardUids,
                my_posts_uids: [-1],
                my_votes_uids: [{uid: 0, vote: 0}]
            });

            var x = document.getElementById("snackbar");
            x.innerHTML ="New user created and signed in";
            x.className = "show";

            setTimeout(function () {
                x.className = x.className.replace("show", "");
                localStorage.setItem("currentUser",id);
                window.location.href = "./index2.html";
            }, 2000);

        }
        else{
            var x = document.getElementById("snackbar");
            x.innerHTML ="Passwords don't match";
            x.className = "show";

            $('#password1').empty();
            $('#password2').empty();

            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);



        }



    });
});