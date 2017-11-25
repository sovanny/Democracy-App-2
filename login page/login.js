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


//var currentUser = 0

$(document).ready(function(){
    $("#loginBtn").click(function(){
        id = document.getElementById("id").value;
        psw = document.getElementById("password").value;
        userRef.once("value")
            .then(function(snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if ((childSnapshot.val().ID == id) && (childSnapshot.val().password == psw)) {
                        console.log('success');
                       // currentUser = id;
                        // go to feed
                        // console.log(currentUser) // = 20150950
                        //database.ref("currentUserID").push({currentUser: id});
                        database.ref('currentUserID').once("value")
                            .then(function (snapshot) {
                                snapshot.forEach(function (childSnapshot) {
                                    childSnapshot.ref.update({currentUser: id})
                                    //currentUser = id
                                    localStorage.setItem("currentUser",id);
                                    console.log(currentUser) // = 20150950
                                    window.location.href = "./index2.html";
                                })
                            })
                    } else {
                        console.log('failed');
                        //console.log(psw);
                        //console.log(id);
                    }
                })
            })
    });
});






// List of card UID that they voted agree on
// List of card UID that they voted disagree on
// List of card UID that they created
// List of card UID that they flagged

// $( document ).ready(function() {
//     $.ajax({
//         method: "GET",
//         url:  "https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv",
//         success: function(data, status) {
//             var allTextLines = data.split(/\r\n|\n/);
//
//             var headers = allTextLines[0].split(',');
//             for (var i=1; i<allTextLines.length; i++) {
//                 var data = allTextLines[i].split(',');
//                 pairs.push({"country":data[0],"capital":data[1]});        // pairs contains objects, but not the right ones (checked on a console)
//                 capitals.push(data[1])
//             }
//             $ (document).ready(main());
//         }});
// });