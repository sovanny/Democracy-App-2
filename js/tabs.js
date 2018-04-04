/*
 This module contains functions used to update post lists in different tabs 'feed_uids', 'my_votes_uids' and 'my_posts_uids'
*/

var userRef = database.ref("users")
var currentUser = localStorage.getItem("currentUser")

/* add a card_id to feed_uids of a given user
   @param: card-id, user-id
   @return: none
*/
function add_feed_uid(feed_uid, user_id) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var feed_uids_new = [];
                if (childSnapshot.val().ID == user_id) {
                    feed_uids_new = childSnapshot.val().feed_uids
                    feed_uids_new.push(feed_uid)
                    childSnapshot.ref.update({feed_uids: feed_uids_new});
                }
            })
        })
}

/* remove a card_id from feed_uids of the current user
    @param: card-id
    @return: none
*/
function remove_feed_uid(feed_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var feed_uids_new = [];
                if (childSnapshot.val().ID == currentUser) {
                    feed_uids_new = childSnapshot.val().feed_uids
                    // checks if feed_uid is in feed_uids, and if it is, - remove it
                    if (feed_uids_new.indexOf(feed_uid) > -1) {
                        feed_uids_new.splice(feed_uids_new.indexOf(feed_uid), 1)
                    }
                    childSnapshot.ref.update({feed_uids: feed_uids_new});
                }
            })})
}


/* add a card_id to my_posts_uids of the current user
    @param: card-id
    @return: none
*/
function add_my_post_uid(my_post_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var my_posts_uids_new = [];
                if (childSnapshot.val().ID == currentUser) {
                    my_posts_uids_new = childSnapshot.val().my_posts_uids
                    my_posts_uids_new.push(my_post_uid)
                    childSnapshot.ref.update({my_posts_uids: my_posts_uids_new});
                }
            })})
}

/* remove a card_id from my_post_uids of the current user
    @param: card-id
    @return: none
*/
function remove_my_post_uid(my_post_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var my_posts_uids_new = [];
                if (childSnapshot.val().ID == currentUser) {
                    my_posts_uids_new = childSnapshot.val().my_posts_uids
                    // checks if my_post_uid is in my_posts_uids, and if it is, - remove it
                    if (my_posts_uids_new.indexOf(my_post_uid) > -1) {
                        my_posts_uids_new.splice(my_posts_uids_new.indexOf(my_post_uid), 1)
                    }
                    childSnapshot.ref.update({my_posts_uids: my_posts_uids_new});
                }
            })})
}

/* add a card_id to my_vote_uids of the current user
    @param: card-id
    @return: none
*/
function add_my_vote_uid(my_vote_uid, vote) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var my_votes_uids_new = [];
                if (childSnapshot.val().ID == currentUser) {
                    my_votes_uids_new = childSnapshot.val().my_votes_uids
                    my_votes_uids_new.push({uid: my_vote_uid, vote: vote})
                    childSnapshot.ref.update({my_votes_uids: my_votes_uids_new});
                }
            })
        })
}

/* remove a card_id from my_vote_uids of the current user
    @param: card-id
    @return: none
*/
function remove_my_vote_uid(my_vote_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var my_votes_uids_new = [];
                if (childSnapshot.val().ID == currentUser) {
                    my_votes_uids_new = childSnapshot.val().my_votes_uids
                    // checks if my_vote_uid is in my_votes_uids, and if it is, - remove it
                    for (i = 0; i < my_votes_uids_new.length; i++) {
                        if (my_vote_uid == my_votes_uids_new[i].uid) {
                            my_votes_uids_new.splice(i, 1)
                            childSnapshot.ref.update({my_votes_uids: my_votes_uids_new})
                        }
                    }
                }
            })
        })
}

/* add a card_id to feed_uids of every user
    @param: card-id
    @return: none
*/
function add_new_post_to_feed(uid) {
    userRef.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                add_feed_uid(uid, childSnapshot.val().ID)
            })
        })
}

/* load all the cards from a given uidList (either feed, my_posts, or my_votes), and append them to the view.
    @param:
        uidList - list of ints, uids to append to the view.
        list_type - feed, my_votes, or my_posts
    @return: none
*/
function loadCardContent($view, uidList, list_type) {
    var cardContent = database.ref('cards');
    var agreedClass = "", disagreedClass = "", cardStatusClass = "", statusTextHtml = "", flag_class = "";

    // empty the current content
    $view.empty();

    // display cards
    cardContent.orderByChild('time_stamp').once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                card = childSnapshot.val()
                if (uidList.indexOf(card.UID) > -1) {

                    agreedClass = 'notClicked';
                    disagreedClass = "notClicked";

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
                    cardStatusClass = 'unhandled';
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
                    statusTextHtml = "";

                    // This block will create the html for the Status Messages
                    if (card.stage > 0) {
                        statusTextHtml = "<div class=\"status-msg-list-container\">\n";
                        // for each message in the list
                        for (var message in card.status_log) {

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
                    // should be changed to determine this from flagged_uids instead
                    if (card.flagged_users.includes(currentUser)) {
                        console.log("this card has been flagged: " + card.UID)
                        flag_class = "flagged"
                    } else {
                        flag_class = "notClicked"
                    }
                    // new version
                    //
                    $view.prepend("<div class=\"card " + cardStatusClass + "\"" + "id=\"" + card.UID + "\"" + ">\n" +
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
                        "            <i class=\"fa fa-flag " + flag_class + "\"" + "id=\"" + "flagBtn" + card.UID  +  "\"aria-hidden=\"true\"></i>\n" +
                        // "            <i class=\"fa fa-flag notClicked\"  aria-hidden=\"true\"></i>\n" +
                        "        </div>\n" +
                        "    <div class=\"date-container\">\n" +
                        card.time_stamp.toString().substr(0, 10) +
                        "    </div>\n" +
                        "\n" +
                        "    <div class=\"arrow-container\">\n" +
                        "<i class=\"fa fa-angle-double-down\" aria-hidden=\"true\"></i>\n" +
                        "    </div>\n" +
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
                        document.getElementById("flagBtn" + card.UID).disabled = true;
                    }
                    /* disable voting buttons for my_posts
                     this functionality should be uncommented, but is currently buggy. agreeBtn is not initialized by the time this code is called,
                     resulting in accessing the "disabled" attribute of null.
                    */
                    // userRef.once("value")
                    //     .then(function (snapshot) {
                    //         snapshot.forEach(function (childSnapshot) {
                    //             if ((childSnapshot.val().ID == currentUser) && (childSnapshot.val().my_posts_uids.includes(card.UID))) {
                    //                 document.getElementById("agreeBtn" + card.UID).disabled = true;
                    //                 document.getElementById("disagreeBtn" + card.UID).disabled = true;
                    //             }
                    //         })
                    //     })

                }
            })
        });
}

/*  get the uids of all the cards in a given uid list (either feed, my_posts, or my_votes)
    @param:
        list type - feed, my_votes, or my_posts
    @return: list of ints (uids)
*/
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
    return listOfUids;
}