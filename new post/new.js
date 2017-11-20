//firebase();
//  var config = {
//      apiKey: "AIzaSyD8sQuV_OsNSqbHgVnQFKn6d2YCDGlfJxc",
//      databaseURL: "https://democracy-app-kaist.firebaseio.com/"
// }
//
// firebase.initializeApp(config);
// var database = firebase.database()


var userRef = database.ref("users")
var cardRef = database.ref("cards")
var myPostRef = database.ref("my_posts_uids")

var next_uidRef = database.ref("next_uid")
//
//
// console.log('below')
next_uidRef.once("value")
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            next_uid = childSnapshot.val();
        })})




$(document).ready(function(){
    $('#feed-container').on('click', '#postBtn', function(e){
        title = document.getElementById("title").value;
        details = document.getElementById("details").value;
        url = document.getElementById("url").value;
        date = document.getElementById("date").value;
        // date.placeholder = Date.now();
        // if user didn't type date, it will be set to current date
        if (date == "") {
            date = Date.now();
        }
        cardRef.push({
            UID: next_uid,
            my_count: 1,
            title: title,
            text: details,
            agree_count: 0,
            disagree_count: 0,
            time_stamp: date,
            media_url: url,
            flag_status: "noflag",
        });

        // also add this UIDs to my_posts
        myPostRef.push({
            UID: next_uid,
        });
        // don't add it to my_votes

        next_uidRef.once("value")
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    snapshot.ref.update({ next_uid: next_uid + 1 })
                    next_uid += 1;
                })})
        //window.location.href = "../index.html";
    //     $.ajax({
    //         url: "feed.html",
    //         success: function (data) {
    //             $('#feed-container2').empty();
    //             $('#feed-container2').append(data)
    //         },
    //         dataType: 'html'
    //     });
    // });
        const $view = $('#feed-container')
        var listOfUids = getUidList("my_posts_uids")

        loadCardContent($view, listOfUids);
        // A variable for the tabs
        const $tabs = $('#bottom-navbar .tab')

        // Run selectTab and loadCardContent once in order to show something upon loading
        selectTab($tabs, $($tabs[2]))
    })

});

function selectTab($tabs, $tab) {
    const selectedClass = 'selected';
    $tabs.removeClass(selectedClass);
    $tab.addClass(selectedClass);
}

function getUidList(nameOfList){
    var listOfUids = []
    var myPostsListRef = database.ref(nameOfList);

    myPostsListRef.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot.val().UID)
                listOfUids.push(childSnapshot.val().UID)
            })
        })
    return listOfUids;
}

// // This is the actual function that we can use

function loadCardContent($view, uidList) {

    // empty the current content
    $view.empty();

    var cardContent = database.ref('cards');
    console.log(cardContent);

    /* Checks for newly added cards
    cardContent.on('child_added', function (snapshot) {
        var data = snapshot.val();
        console.log(data)
        console.log('jag kör')

    });*/


    cardContent.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                card = childSnapshot.val()
                if (uidList.indexOf(card.UID) > -1){
                    $view.append("<div class=\"card\"" + "id=\"" + card.UID + "\"" +">\n" +
                        "        <p class=\"card-title\">\n" +
                        card.title +
                        "        </p>\n" +
                        //"        <p class=\"card-content\">\n" +
                        //card.text +
                        //"        </p>\n" +
                        "        <div class=\"footer-container\">\n" +
                        "<div class=\"flag-container\">\n" +
                        "            <i class=\"fa fa-flag notClicked\" aria-hidden=\"true\"></i>\n" +
                        "        </div>\n" +
                        "    <div class=\"date-container\">\n" +
                        "        13 nov '17\n" +
                        "    </div>\n" +
                        "\n" +
                        "        <div class=\"disagree-container\">\n" +
                        "            <i class=\"fa fa-times notClicked\" aria-hidden=\"true\"></i>\n" +
                        "<span class=\"disagree-count\">" + card.disagree_count + "</span>" +
                        "        </div>\n" +
                        "        <div class=\"agree-container\">\n" +
                        "            <i class=\"fa fa-check notClicked\" aria-hidden=\"true\"></i>\n" +
                        "<span class=\"agree-count\">" + card.agree_count  + "</span>" +
                        "        </div>" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "        </div>\n" +
                        "    </div>");
                }
            })});

}





// Card attributes:
//     UID
//     Title
//     Descriptive text
//     Flag status
//     Agree count
//     Disagree count
//     Time stamp
//     Media url

