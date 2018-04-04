/*
    This module contains functions used to implement all the buttons present on a card (agree, disagree, flag)
*/


/* Describes the behaviour of the the 'flag' button present on each card
   @param: $button
   @return: none
*/
function flagPost($button) {
    const flaggedClass = 'flagged';
    const notClickedClass = 'notClicked';
    var cardUid = parseInt($button.closest("div .card").prop("id"));
    var index = 0;
    var flagged_users_new = [];

    // add currentUser to flagged users
    cardRef.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().UID == cardUid) {
                    // apply different rules if current user is one of the admins
                    if ((currentUser == 20150950) || (currentUser == 20176472) || (currentUser == 20176478)) {
                        flagged_users_new = childSnapshot.val().flagged_users;
                        // The card has been flagged (not unflagged)
                        if (!flagged_users_new.includes(currentUser)) {
                            $button.removeClass(notClickedClass);
                            $button.addClass(flaggedClass);
                            // add everyone to the flagged_users list of the current card
                            userRef.once("value")
                                .then(function (snapshot2) {
                                    snapshot2.forEach(function (childSnapshot2) {
                                        // if user is not already in the list
                                        if (!flagged_users_new.includes(childSnapshot2.val().ID.toString())) {
                                            flagged_users_new.push(childSnapshot2.val().ID.toString())
                                            childSnapshot.ref.update({flagged_users: flagged_users_new});
                                        }
                                    })
                                })
                            showSnackbarFlag()
                        // The card has been unflagged
                        } else {
                            $button.removeClass(flaggedClass);
                            $button.addClass(notClickedClass);
                            index = 0
                            // remove everyone from the flagged_users list of the current card
                            userRef.once("value")
                                .then(function (snapshot2) {
                                    snapshot2.forEach(function (childSnapshot2) {
                                        index = flagged_users_new.indexOf(childSnapshot2.val().ID.toString());
                                        if (index > -1) {
                                            flagged_users_new.splice(index, 1);
                                            childSnapshot.ref.update({flagged_users: flagged_users_new});
                                        }

                                    })
                                })
                        }
                    // if current user is NOT one of the admins
                    } else {
                        console.log('not admin')
                        flagged_users_new = childSnapshot.val().flagged_users;
                        // if the user has flagged the post
                        if (!flagged_users_new.includes(currentUser)) {
                            console.log('unflagged')
                            $button.removeClass(notClickedClass);
                            $button.addClass(flaggedClass);
                            flagged_users_new.push(currentUser)
                            childSnapshot.ref.update({flagged_users: flagged_users_new});
                            showSnackbarFlag()
                        // if the user has unflagged the post
                        } else {
                            $button.removeClass(flaggedClass);
                            $button.addClass(notClickedClass);
                            index = flagged_users_new.indexOf(currentUser);
                            if (index > -1) {
                                flagged_users_new.splice(index, 1);
                                childSnapshot.ref.update({flagged_users: flagged_users_new});
                            }

                        }
                    }
                }
            })
        })
}


/* Describes the behaviour of the the 'agree' button present on each card
   @param: $button
   @return: none
*/
function agree($button) {
    const agreedClass = 'agreed';
    const notClickedClass = 'notClicked';
    var old_count = 0;
    var cardUid = 0;
    var old_agree_count = 0;
    var old_disagree_count = 0;
    var my_votes_uids_new = [];

    // if the user has "anti-clicked" the agree button
    if ($button.hasClass(agreedClass)) {
        $button.removeClass(agreedClass);
        $button.addClass(notClickedClass);
        cardUid = parseInt($button.closest("div .card").prop("id")); // what is this?
        // update agree_count
        database.ref('cards').once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().UID == cardUid) {

                        old_count = childSnapshot.val().agree_count;
                        document.getElementById("agree-count" + cardUid).innerHTML = old_count - 1
                        childSnapshot.ref.update({agree_count: old_count - 1});
                    }
                })
            });
        remove_my_vote_uid(cardUid)
        add_feed_uid(cardUid, currentUser)

        // slowly hide the card
        $('#' + cardUid).toggle('slide');

    // if the user has clicked the agree button
    } else {
        $button.removeClass(notClickedClass);
        $button.addClass(agreedClass);
        cardUid = parseInt($button.closest("div .card").prop("id"));
        // update agree_count
        database.ref('cards').once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().UID == cardUid) {
                        old_agree_count = childSnapshot.val().agree_count
                        old_disagree_count = childSnapshot.val().disagree_count
                        remove_feed_uid(cardUid)
                        if (old_agree_count == 99) {
                            $("#" + cardUid).addClass('in-progress')
                        }
                        document.getElementById("agree-count" + cardUid).innerHTML = old_agree_count + 1
                        childSnapshot.ref.update({agree_count: old_agree_count + 1});
                        // if post was priorly downvoted, anti-click the 'disagree' button
                        if (document.getElementById("disagreeBtn" + cardUid).classList.contains('disagreed')) {
                            // visually "uncheck" disagreed button
                            document.getElementById("disagreeBtn" + cardUid).classList.remove("disagreed")
                            $("#disagreeBtn" + cardUid).addClass('noClicked')
                            document.getElementById("disagree-count" + cardUid).innerHTML = old_disagree_count - 1
                            // update count in firebase
                            childSnapshot.ref.update({disagree_count: old_disagree_count - 1})
                            // update the vote status for the card in my_votes_uids
                            userRef.once("value")
                                .then(function(snapshot) {
                                    snapshot.forEach(function(childSnapshot) {
                                        if (childSnapshot.val().ID == currentUser) {
                                            my_votes_uids_new = childSnapshot.val().my_votes_uids
                                            // checks if my_vote_uid is in my_votes_uids, and if it is, - remove it
                                            for (i = 0; i < my_votes_uids_new.length; i++) {
                                                if (cardUid == my_votes_uids_new[i].uid) {
                                                    my_votes_uids_new[i].vote = -1
                                                    childSnapshot.ref.update({my_votes_uids: my_votes_uids_new})
                                                }
                                            }
                                        }
                                    })
                                })
                        } else {
                            add_my_vote_uid(cardUid, -1)
                        }



                    }
                })
            });

        // Add snackbar (toast message)
        showSnackbar();

        // slowly hide the card
        $('#' + cardUid).toggle('slide');
    }

}


/* Describes the behaviour of the the 'disagree' button present on each card
   @param: $button
   @return: none
*/
function disAgree($button) {
    const disagreedClass = 'disagreed';
    const notClickedClass = 'notClicked';
    var old_count = 0;
    var cardUid = 0;
    var old_agree_count = 0;
    var old_disagree_count = 0;
    var my_votes_uids_new = [];

    // if the user has "anti-clicked" the 'disagree' button
    if ($button.hasClass(disagreedClass)) {
        $button.removeClass(disagreedClass);
        $button.addClass(notClickedClass);
        cardUid = parseInt($button.closest("div .card").prop("id"));
        // update disagree_count
        database.ref('cards').once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().UID == cardUid) {

                        old_count = childSnapshot.val().disagree_count;
                        document.getElementById("disagree-count" + cardUid).innerHTML = old_count - 1
                        childSnapshot.ref.update({disagree_count: old_count - 1});
                    }
                })
            });
        remove_my_vote_uid(cardUid)
        add_feed_uid(cardUid, currentUser)

        // slowly hide the card
        $('#' + cardUid).toggle('slide');
    // if the user has clicked the 'disagree' button
    } else {
        $button.removeClass(notClickedClass);
        $button.addClass(disagreedClass);


        cardUid = parseInt($button.closest("div .card").prop("id"));
        // update agree_count
        database.ref('cards').once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().UID == cardUid) {
                        old_agree_count = childSnapshot.val().agree_count
                        old_disagree_count = childSnapshot.val().disagree_count
                        remove_feed_uid(cardUid)
                        document.getElementById("disagree-count" + cardUid).innerHTML = old_disagree_count + 1
                        childSnapshot.ref.update({disagree_count: old_disagree_count + 1});
                        // // if post was priorly upvoted, anti-click the 'agree' button
                        if (document.getElementById("agreeBtn" + cardUid).classList.contains('agreed')) {
                            // visually "uncheck" agreed button
                            document.getElementById("agreeBtn" + cardUid).classList.remove("agreed")
                            $("#agreeBtn" + cardUid).addClass('noClicked')
                            document.getElementById("agree-count" + cardUid).innerHTML = old_agree_count - 1
                            // update count in firebase
                            childSnapshot.ref.update({agree_count: old_agree_count - 1})
                            // update the vote status for the card in my_votes_uids
                            userRef.once("value")
                                .then(function(snapshot) {
                                    snapshot.forEach(function(childSnapshot) {
                                        if (childSnapshot.val().ID == currentUser) {
                                            my_votes_uids_new = childSnapshot.val().my_votes_uids
                                            // checks if my_vote_uid is in my_votes_uids, and if it is, - remove it
                                            for (i = 0; i < my_votes_uids_new.length; i++) {
                                                if (cardUid == my_votes_uids_new[i].uid) {
                                                    my_votes_uids_new[i].vote = -2
                                                    childSnapshot.ref.update({my_votes_uids: my_votes_uids_new})
                                                }
                                            }
                                        }
                                    })
                                })
                        } else {
                            add_my_vote_uid(cardUid, -2)
                        }
                    }
                })
            });

        showSnackbar();

        // slowly hide the card
        $('#' + cardUid).toggle('slide');
    }

}

$(window).on("load", function () {
    // "Feedback" button
    $("#feedbackBtn").click(function () {
        window.open("https://goo.gl/forms/DrU0bIC0lhceWkmH2")
    });
    // "About" button
    $("#aboutBtn").click(function () {
        window.open("../html/about.html")
    });
});


/* Make the "snackbar" element visible
   @param: none
   @return: none
*/
function showSnackbar(){
    var x = document.getElementById("snackbar")
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

/* Make the "snackbarFlag" element visible
   @param: none
   @return: none
*/
function showSnackbarFlag(){
    var x = document.getElementById("snackbarFlag")
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}
