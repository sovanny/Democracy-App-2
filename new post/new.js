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
        // not using url right now
        //url = document.getElementById("url").value;
        url ="";
        //date = document.getElementById("date").value;
        var d = new Date();
        date = d.toISOString()
        // date.placeholder = Date.now();
        // if user didn't type date, it will be set to current date
        //if (date == "") {
        //    var d = new Date();
        //    date = d.toISOString()
        //}
        cardRef.push({
            UID: next_uid,
            title: title,
            text: details,
            agree_count: 0,
            disagree_count: 0,
            time_stamp: date,
            stage: 0,
            media_url: url,
            flag_status: "noflag",
        });

        // also add this UIDs to my_posts
        add_my_post_uid(next_uid)

        // add the post to everyone's feed
        add_new_post_to_feed(next_uid)

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
        //var listOfUids = getUidList("my_posts_uids")
        //loadCardContent($view, listOfUids);
        // A variable for the tabs
        //const $tabs = $('#bottom-navbar .tab')
        // Run selectTab and loadCardContent once in order to show something upon loading
        //selectTab($tabs, $($tabs[2]))

        setTimeout(function () {
            var listOfUids2 = getUidList("my_posts_uids")
            loadCardContent($view, listOfUids2);
            // A variable for the tabs
            const $tabs = $('#bottom-navbar .tab')
            // Run selectTab and loadCardContent once in order to show something upon loading
            selectTab($tabs, $($tabs[2]))
        }, 1500);



    })

});


// add a post to everyone's feed
function add_new_post_to_feed(uid) {
    //users = get_all_user_ids()
    // decided to have a fixed list of ids instead of using get_all_user_ids() due to bugs
    users = [20150950, 20176472, 20176478, 0]
    for (i = 0; i < users.length; i++) {
        add_feed_uid(uid, users[i])
    }
}

// function get_all_user_ids() {
//     user_ids = []
//     database.ref('users').once("value")
//         .then(function (snapshot) {
//             snapshot.forEach(function (childSnapshot) {
//                 user_ids.push(childSnapshot.val().ID)
//             })
//         })
//     return user_ids
// }
function selectTab($tabs, $tab) {
    const selectedClass = 'selected';
    $tabs.removeClass(selectedClass);
    $tabs.children().removeClass(selectedClass);

    $tab.addClass(selectedClass);
    $tab.children().addClass(selectedClass);
}

function loadCardContent($view, uidList, list_type) {

    // empty the current content
    $view.empty();
    var cardContent = database.ref('cards');
    console.log(list_type)
    console.log(uidList)

    // display cards
    //console.log(uidList) // wrong == feed_uids
    cardContent.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                card = childSnapshot.val()
                if (uidList.indexOf(card.UID) > -1) {

                    var agreedClass = 'notClicked';
                    var disagreedClass = "notClicked";

                    /////////////////////////////////// only this is specific to votes - start
                    if (list_type == 'votes') {
                        if (uidList[uidList.indexOf(card.UID) + 1] == -2) {   /// can get bugs here if card is stored several times
                            disagreedClass = "disagreed";
                        } else if (uidList[uidList.indexOf(card.UID) + 1] == -1) {
                            agreedClass = "agreed";
                        }
                    } else if (list_type == 'my_posts') {
                        agreedClass = "agreed"
                    }
                    /////////////////////////////////// only this is specific to votes - end
                    var cardStatusClass = 'unhandled';
                    // When the status field is available
                    if (card.stage == 1) {
                        cardStatusClass = 'in-progress';
                    }
                    else if (card.stage == 2) {
                        cardStatusClass = 'closed';
                    }
                    else if (card.stage == 3) {
                        cardStatusClass = 'cancelled';
                    }
                    var statusTextHtml = "";

                    // This block will create the html for the Status Messages
                    if (card.stage > 0) {
                        statusTextHtml = "<div class=\"status-msg-list-container\">\n";
                        // for each message in the list
                        for (var message in card.status_log) {
                            console.log(card.status_log[message]);
                            statusTextHtml += "<div class=\"status-msg-container\">\n" +
                                "        <p class=\"status-msg-time\">\n" +
                                //first 16 chars in string toString().substr(0,16)-->
                                card.status_log[message].time_stamp.toString().substr(0, 16) +
                                "        </p>\n" +
                                "        <p class=\"status-msg-text\">\n" +
                                card.status_log[message].message +
                                "        </p>\n" +
                                "    </div>";
                        }
                        statusTextHtml += "</div>";
                    }

                    $view.append("<div class=\"card " + cardStatusClass + "\"" + "id=\"" + card.UID + "\"" + ">\n" +
                        "        <p class=\"card-title \">\n" +
                        card.title +
                        "        </p>\n" +
                        "<div id=\"expandable-content\" style=\"display: none;\">\n" +
                        "        <p class=\"card-content\">\n" +
                        card.text +
                        "        </p>\n" +
                        statusTextHtml +
                        "    </div>\n" +
                        "        <div class=\"footer-container\">\n" + ////
                        "<div class=\"flag-container\">\n" +
                        "            <i class=\"fa fa-flag notClicked\"  aria-hidden=\"true\"></i>\n" +
                        "        </div>\n" +
                        "    <div class=\"date-container\">\n" +
                        card.time_stamp.toString().substr(0, 10) +
                        "    </div>\n" +
                        "\n" +
                        "        <div class=\"disagree-container\">\n" +  //
                        "            <i class=\"fa fa-times " + disagreedClass + "\"" + "id=\"" + "disagreeBtn" + card.UID  + "\" aria-hidden=\"true\"></i>\n" +
                        "<span class=\"disagree-count"  + "\"" + "id=\"" + "disagree-count" + card.UID + "\"" + ">" + card.disagree_count + "</span>" +
                        "        </div>\n" +
                        "        <div class=\"agree-container\">\n" +
                        "            <i class=\"fa fa-check " + agreedClass + "\"" + "id=\"" + "agreeBtn" + card.UID  + "\" aria-hidden=\"true\"></i>\n" +
                        "<span class=\"agree-count" + "\"" + "id=\"" + "agree-count" + card.UID + "\"" + ">" + card.agree_count + "</span>" +
                        "        </div>" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "        </div>\n" +
                        "    </div>");
                    // if card is closed, make buttons inactive
                    if (card.stage == 2) {
                        document.getElementById("agreeBtn" + card.UID).disabled = true;
                        document.getElementById("disagreeBtn" + card.UID).disabled = true;
                    }
                }
            })
        });
}



function getUidList(nameOfList) {
    var listOfUids = []
    var ref = database.ref('users');

    ref.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().ID == currentUser) {
                    if (nameOfList == 'feed_uids') {
                        temp = childSnapshot.val().feed_uids
                        for (i = 0; i < temp.length; i++) {
                            listOfUids.push(temp[i])
                        }
                    } else if (nameOfList == 'my_posts_uids') {
                        temp = childSnapshot.val().my_posts_uids
                        for (i = 0; i < temp.length; i++) {
                            listOfUids.push(temp[i])
                        }
                    } else if (nameOfList == 'my_votes_uids') {
                        temp = childSnapshot.val().my_votes_uids
                        for (i = 0; i < temp.length; i++) {
                            // lisOfUids looks different for 'my_votes_uids'. It has twice the length
                            listOfUids.push(temp[i].uid)
                            listOfUids.push(temp[i].vote)
                        }
                    }

                }

            })
        })
    //console.log(listOfUids)
    return listOfUids;
}