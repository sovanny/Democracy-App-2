userRef = database.ref("users")
currentUser = localStorage.getItem("currentUser")
console.log(currentUser)


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////    functions to edit 'feed_uids', 'my_votes_uids' and 'my_posts_uids' fields of 'user' cards: start       ////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// add a card_id to feed_uids of a given user
// add_feed_uid(7)
function add_feed_uid(feed_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val().ID == currentUser) {
                    feed_uids_new = childSnapshot.val().feed_uids
                    feed_uids_new.push(feed_uid)
                    childSnapshot.ref.update({feed_uids: feed_uids_new});
                }
            })})
}

// remove a card_id from feed_uids of a given user
// remove_feed_uid(2)
function remove_feed_uid(feed_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
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


// add a card_id to my_posts_uids of a given user
// add_my_post_uid(7)
function add_my_post_uid(my_post_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val().ID == currentUser) {
                    my_posts_uids_new = childSnapshot.val().my_posts_uids
                    my_posts_uids_new.push(my_post_uid)
                    childSnapshot.ref.update({my_posts_uids: my_posts_uids_new});
                }
            })})
}

// remove a card_id from my_posts_uids of a given user
// remove_my_post_uid(20150950, 2)
function remove_my_post_uid(my_post_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
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

// add a card_id to my_votes_uids of a given user
// add_my_vote_uid(7, 1)  - agreed on card #7
function add_my_vote_uid(my_vote_uid, vote) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val().ID == currentUser) {
                    my_votes_uids_new = childSnapshot.val().my_votes_uids
                    my_votes_uids_new.push({uid: my_vote_uid, vote: vote})
                    childSnapshot.ref.update({my_votes_uids: my_votes_uids_new});
                }
            })
        })
}

// remove a card_id from my_votes_uids of a given user
// remove_my_vote_uid(2)
function remove_my_vote_uid(my_vote_uid) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
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
//add_my_vote_uid(4)
//remove_my_vote_uid(4)



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////    functions to edit 'feed_uids', 'my_votes_uids' and 'my_posts_uids' fields of 'user' cards: end       ////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// When site had loaded
$(window).on("load", function () {

    //Run main function
    start();

    function start() {

        // A variable for the tabs
        var $tabs = $('#bottom-navbar .tab');
        $tabs.push($('.tab-child'))

        // Run selectTab and loadCardContent once in order to show something upon loading
        selectTab($tabs, $($tabs[0]))

        var listOfUids = getUidList('feed_uids');
        loadCardContent($('#feed-container'), listOfUids, 'feed');


        //When clicking on the title text
        $('#feed-container').on('click', '.card-title', function (e) {
            // Expand to show post description
            $(this).siblings('#expandable-content').slideToggle("slow");
        })

        // When clicking one of the tabs
        $tabs.on('click', function (e) {
            // Change color of tab
            selectTab($tabs, $(e.target));
            // Display the right view
            changeContent($(e.target));
        })

        // when clicking on checkmark
        $('#feed-container').on('click', '.fa-check', function (e) {
            agree($(e.target));

            var x = document.getElementById("snackbar")
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);


            var uidList;
            // setTimeout(function() { uidList =  getUidList('feed_uids'); }, 3000);
            // setTimeout(function() { loadCardContent($('#feed-container'), uidList); }, 3000);


        })
        // when clicking on X
        $('#feed-container').on('click', '.fa-times', function (e) {
            disAgree($(e.target));

            var x = document.getElementById("snackbar")
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);

            // loadCardContent($('#feed-container'), getUidList('feed_uids'));
        })
        // when clicking on flag
        $('#feed-container').on('click', '.fa-flag', function (e) {
            flagPost($(e.target));
        })

    }

    // function definition
    function selectTab($tabs, $tab) {
        const selectedClass = 'selected';

        if ($tab.hasClass('tab')) {
            $tabs.removeClass(selectedClass);
            $tabs.children().removeClass(selectedClass);

            $tab.addClass(selectedClass);
            $tab.children().addClass(selectedClass);
        }
        else if ($tab.hasClass('tab-child')) {
            $tabs.removeClass(selectedClass);
            $tabs.children().removeClass(selectedClass);

            $tab.addClass(selectedClass);
            $tab.parent().addClass(selectedClass);
        }


    }

    function agree($button) {
        const agreedClass = 'agreed';
        const notClickedClass = 'notClicked';
        // if this is an "anti-click"
        if ($button.hasClass(agreedClass)) {
            $button.removeClass(agreedClass);
            $button.addClass(notClickedClass);
            var cardUid = parseInt($button.closest("div .card").prop("id"));
            // update agree_count
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().agree_count;

                            childSnapshot.ref.update({agree_count: old_count - 1});
                        }
                    })
                });
            remove_my_vote_uid(cardUid)
            add_feed_uid(cardUid)
        } else {
            $button.removeClass(notClickedClass);
            $button.addClass(agreedClass);


            var cardUid = parseInt($button.closest("div .card").prop("id"));
            // update agree_count
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().agree_count;
                            if (old_count == 99) {
                                $("#" + cardUid).addClass('in-progress')
                            }
                            childSnapshot.ref.update({agree_count: old_count + 1});
                        }
                    })
                });
            remove_feed_uid(cardUid)
            add_my_vote_uid(cardUid, -1)
        }

    }

    function disAgree($button) {
        const disagreedClass = 'disagreed';
        const notClickedClass = 'notClicked';
        // if this is "anti-click"
        if ($button.hasClass(disagreedClass)) {
            $button.removeClass(disagreedClass);
            $button.addClass(notClickedClass);
            var cardUid = parseInt($button.closest("div .card").prop("id"));
            // update disagree_count
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().disagree_count;

                            childSnapshot.ref.update({disagree_count: old_count - 1});
                        }
                    })
                });
            remove_my_vote_uid(cardUid)
            add_feed_uid(cardUid)
        } else {
            $button.removeClass(notClickedClass);
            $button.addClass(disagreedClass);


            var cardUid = parseInt($button.closest("div .card").prop("id"));
            // update disagree_count
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().disagree_count;

                            childSnapshot.ref.update({disagree_count: old_count + 1});
                        }
                    })
                });
            remove_feed_uid(cardUid)
            add_my_vote_uid(cardUid, -2)
        }

    }

    function flagPost($button) {
        const flaggedClass = 'flagged';
        const notClickedClass = 'notClicked';
        $button.removeClass(notClickedClass);
        $button.addClass(flaggedClass);
    }

    // function definition
    function changeContent($tab) {

        // What element to append view to
        const $view = $('#feed-container')

        //Check the ID of the tab clicked
        if ($tab.hasClass('home-feed-view')) {
            var listOfUids = getUidList('feed_uids');
            loadCardContent($view, listOfUids, 'feed');
        }
        else if ($tab.hasClass('my-votes-view')) {
            var listOfUids = getUidList('my_votes_uids');
            console.log(listOfUids) // - correct, but not sure if it's loaded fast enough
            loadCardContent($view, listOfUids, 'votes');
        }
        else if ($tab.hasClass('my-posts-view')) {

            var listOfUids = getUidList('my_posts_uids');
            loadCardContent($view, listOfUids, 'my_posts');
        }
        else if ($tab.hasClass('new-post-view')) {
            loadHtml($view, 'new post/new');
        }
    }

    // This function is used for testing
    // It loads an html file into the selected element
    function loadHtml($view, fileName) {
        $.ajax({
            url: fileName + ".html",
            success: function (data) {
                $view.empty();
                $view.append(data)
            },
            dataType: 'html'
        });
    }

    // This is the actual function that we can use
    function loadCardContent($view, uidList, list_type) {

        // empty the current content
        $view.empty();
        var cardContent = database.ref('cards');
        console.log(list_type)

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
                            if (uidList[uidList.indexOf(card.UID) + 1] == -2) {
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
                            "        <div class=\"footer-container\">\n" +
                            "<div class=\"flag-container\">\n" +
                            "            <i class=\"fa fa-flag notClicked\"  aria-hidden=\"true\"></i>\n" +
                            "        </div>\n" +
                            "    <div class=\"date-container\">\n" +
                            card.time_stamp.toString().substr(0, 10) +
                            "    </div>\n" +
                            "\n" +
                            "        <div class=\"disagree-container\">\n" +
                            "            <i class=\"fa fa-times " + disagreedClass + "\" aria-hidden=\"true\"></i>\n" +
                            "<span class=\"disagree-count\">" + card.disagree_count + "</span>" +
                            "        </div>\n" +
                            "        <div class=\"agree-container\">\n" +
                            "            <i class=\"fa fa-check " + agreedClass + "\" aria-hidden=\"true\"></i>\n" +
                            "<span class=\"agree-count\">" + card.agree_count + "</span>" +
                            "        </div>" +
                            "        </div>\n" +
                            "    </div>\n" +
                            "        </div>\n" +
                            "    </div>");
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

});


//add example users. Should be commented.
// -2 == disagree; -1 == agree
// userRef.push({
//     ID: 20150950,
//     password: 'olzhas',
//     feed_uids: [3, 4, 5, 6, 7],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 1, vote: -1}, {uid: 2, vote: -2}]
// });
// userRef.push({
//     ID: 20170001,
//     password: 'simon',
//     feed_uids: [1, 4, 5, 6, 7],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 2, vote: -1}, {uid: 3, vote: -2}]
// });
// userRef.push({
//     ID: 20170002,
//     password: 'sanni',
//     feed_uids: [1, 2, 3, 6, 7],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 4, vote: -2}, {uid: 5, vote: -1}]
// });

