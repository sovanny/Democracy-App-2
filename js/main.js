userRef = database.ref("users")
currentUser = localStorage.getItem("currentUser")
console.log(currentUser)


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////    functions to edit 'feed_uids', 'my_votes_uids' and 'my_posts_uids' fields of 'user' cards: start       ////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// add a card_id to feed_uids of a given user
// add_feed_uid(7, 2)
function add_feed_uid(feed_uid, user_id) {
    userRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val().ID == user_id) {
                   // console.log('mistake ' + user_id)
                    feed_uids_new = childSnapshot.val().feed_uids
                    feed_uids_new.push(feed_uid)
                    childSnapshot.ref.update({feed_uids: feed_uids_new});
                }
            })
        })
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

        //When clicking on the arrow
        $('#feed-container').on('click', '.arrow-container', function (e) {
            // Expand to show post description
            $(this).parent().siblings('#expandable-content').slideToggle("slow");
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





            //var uidList;
            // setTimeout(function() { uidList =  getUidList('feed_uids'); }, 3000);
            // setTimeout(function() { loadCardContent($('#feed-container'), uidList); }, 3000);


        })
        // when clicking on X
        $('#feed-container').on('click', '.fa-times', function (e) {
            disAgree($(e.target));



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

    //Show the snackbar (when the user has voted)
    function showSnackbar(){
        var x = document.getElementById("snackbar")
        x.className = "show";
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 3000);
    }

    // new version
    function flagPost($button) {
        // need to give an id to this button
        const flaggedClass = 'flagged';
        const notClickedClass = 'notClicked';
        $button.removeClass(notClickedClass);
        $button.addClass(flaggedClass);
        var cardUid = parseInt($button.closest("div .card").prop("id"));
        // add currentUser to flagged users
        cardRef.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().UID == cardUid) {
                        if ((currentUser == 20150950) || (currentUser == 20176472) || (currentUser == 20176478)) {
                            flagged_users_new = childSnapshot.val().flagged_users
                            userRef.once("value")
                                .then(function (snapshot2) {
                                    snapshot2.forEach(function (childSnapshot2) {
                                        flagged_users_new.push(childSnapshot2.val().ID.toString())
                                        childSnapshot.ref.update({flagged_users: flagged_users_new});
                                    })
                                })
                        } else {
                                flagged_users_new = childSnapshot.val().flagged_users
                                flagged_users_new.push(currentUser)
                                childSnapshot.ref.update({flagged_users: flagged_users_new});
                        }
                    }
                })
            })
        // card to flagged_uids of currentUser
        // userRef.once("value")
        //     .then(function (snapshot) {
        //         snapshot.forEach(function (childSnapshot) {
        //             if (childSnapshot.val().ID == currentUser) {
        //                 flagged_uids_new = childSnapshot.val().flagged_uids
        //                 flagged_uids_new.push(cardUid)
        //                 childSnapshot.ref.update({flagged_uids: flagged_uids_new});
        //
        //             }
        //         })
        //     })
        // if it's one of the admins (Simon, Sanni or Olzhas), then make it appear flagged on everyone's feed [not just owr own]

        // if ((currentUser == 20150950) || (currentUser == 20176472) || (currentUser == 20176478)) {
        //     // put it into everyone's flagged_uids
        //     userRef.once("value")
        //         .then(function (snapshot) {
        //             snapshot.forEach(function (childSnapshot) {
        //                 flagged_uids_new = childSnapshot.val().flagged_uids
        //                 flagged_uids_new.push(cardUid)
        //                 childSnapshot.ref.update({flagged_uids: flagged_uids_new});
        //
        //                 // unflag - later
        //
        //             })
        //         })
        // }

    }

   // old version
   //  function flagPost($button) {
   //      const flaggedClass = 'flagged';
   //      const notClickedClass = 'notClicked';
   //      $button.removeClass(notClickedClass);
   //      $button.addClass(flaggedClass);
   //      var cardUid = parseInt($button.closest("div .card").prop("id"));
   //      cardRef.once("value")
   //          .then(function (snapshot) {
   //              snapshot.forEach(function (childSnapshot) {
   //                  if (childSnapshot.val().UID == cardUid) {
   //                      childSnapshot.ref.update({flag_status: "flagged"});
   //                  }
   //              })
   //          })
   //      console.log(cardUid)
   //  }

    function agree($button) {
        const agreedClass = 'agreed';
        const notClickedClass = 'notClicked';
        // if this is an "anti-click"
        if ($button.hasClass(agreedClass)) {
            $button.removeClass(agreedClass);
            $button.addClass(notClickedClass);
            var cardUid = parseInt($button.closest("div .card").prop("id")); // what is this?
            // console.log(cardUid) // good
            // update agree_count
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().agree_count;
                            document.getElementById("agree-count" + cardUid).innerHTML = old_count - 1
                            childSnapshot.ref.update({agree_count: old_count - 1});
                        }
                    })
                });
             // card = $button.closest("div .card")
             // console.log(card.before('div footer-container').prop("class"))
             // console.log($button.closest("div .card").before("div footer-container").before("div .agree-container").prop("class")) // before("span .agree-count").css("font-color", "red")
            //console.log($button.parent().find('.footer-container').find('.agree-container').prop("class")) //html($('<span>').text('hello'))
           // $(this).parent().parent().find('.divStatus').html($('<span>').text('in progress...'))
            //console.log($button.closest("span .agree-count").innerHTML)
            remove_my_vote_uid(cardUid)
            add_feed_uid(cardUid, currentUser)

            // remove card
            $('#' + cardUid).toggle('slide');

        } else {
            $button.removeClass(notClickedClass);
            $button.addClass(agreedClass);


            var cardUid = parseInt($button.closest("div .card").prop("id"));
            // update agree_count
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            var old_agree_count = childSnapshot.val().agree_count
                            var old_disagree_count = childSnapshot.val().disagree_count
                            remove_feed_uid(cardUid)
                            if (old_agree_count == 99) {
                                $("#" + cardUid).addClass('in-progress')
                            }
                            document.getElementById("agree-count" + cardUid).innerHTML = old_agree_count + 1
                            childSnapshot.ref.update({agree_count: old_agree_count + 1});
                            // if post was priorly downvoted
                            if (document.getElementById("disagreeBtn" + cardUid).classList.contains('disagreed')) {
                                // visually "uncheck" disagreed button
                                document.getElementById("disagreeBtn" + cardUid).classList.remove("disagreed")
                                $("#disagreeBtn" + cardUid).addClass('noClicked')
                                document.getElementById("disagree-count" + cardUid).innerHTML = old_disagree_count - 1
                                // update count in firebase
                                childSnapshot.ref.update({disagree_count: old_disagree_count - 1})
                                // update status in firebase. Don't have to delete the record. Just change its vote status.
                                // don't use add_my_vote_uid. Just update vote status. Use it in else cause. This will work smoothly
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

            // remove card
            $('#' + cardUid).toggle('slide');
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
                            document.getElementById("disagree-count" + cardUid).innerHTML = old_count - 1
                            childSnapshot.ref.update({disagree_count: old_count - 1});
                        }
                    })
                });
            remove_my_vote_uid(cardUid)
            add_feed_uid(cardUid, currentUser)

            // remove card
            $('#' + cardUid).toggle('slide');

        } else {
            $button.removeClass(notClickedClass);
            $button.addClass(disagreedClass);


            var cardUid = parseInt($button.closest("div .card").prop("id"));
            // update agree_count
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            var old_agree_count = childSnapshot.val().agree_count
                            var old_disagree_count = childSnapshot.val().disagree_count
                            remove_feed_uid(cardUid)
                            document.getElementById("disagree-count" + cardUid).innerHTML = old_disagree_count + 1
                            childSnapshot.ref.update({disagree_count: old_disagree_count + 1});
                            // if post was priorly upvoted
                            if (document.getElementById("agreeBtn" + cardUid).classList.contains('agreed')) {
                                // visually "uncheck" agreed button
                                document.getElementById("agreeBtn" + cardUid).classList.remove("agreed")
                                $("#agreeBtn" + cardUid).addClass('noClicked')
                                document.getElementById("agree-count" + cardUid).innerHTML = old_agree_count - 1
                                // update count in firebase
                                childSnapshot.ref.update({agree_count: old_agree_count - 1})
                                // update status in firebase. Don't have to delete the record. Just change its vote status.
                                // don't use add_my_vote_uid. Just update vote status. Use it in else cause. This will work smoothly
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

            // remove card
            $('#' + cardUid).toggle('slide');
        }

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
            //console.log(listOfUids) // - correct, but not sure if it's loaded fast enough
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
        console.log(uidList)

        // display cards
        //console.log(uidList) // wrong == feed_uids
        cardContent.orderByChild('time_stamp').once("value")
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
                            var flag_class = "flagged"
                        } else {
                            var flag_class = "notClicked"
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
                        // disable voting buttons for my_posts
                        // somehow doesn't work for Alisher's posts
                        userRef.once("value")
                            .then(function (snapshot) {
                                snapshot.forEach(function (childSnapshot) {
                                    if ((childSnapshot.val().ID == currentUser) && (childSnapshot.val().my_posts_uids.includes(card.UID))) {
                                        document.getElementById("agreeBtn" + card.UID).disabled = true;
                                        document.getElementById("disagreeBtn" + card.UID).disabled = true;
                                    }
                                })
                            })

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
    $("#feedbackBtn").click(function() {
        console.log('feedback')
        window.open("https://goo.gl/forms/DrU0bIC0lhceWkmH2")
    });
    $("#aboutBtn").click(function() {
        console.log('about')
        window.open("./about/about.html")
    });

});



//add example users. Should be commented.
// -2 == disagree; -1 == agree
// userRef.push({
//     ID: 20150950,
//     password: 'olzhas',
//     feed_uids: [0, 3, 4, 5, 6, 7],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 0, vote: 0}, {uid: 1, vote: -1}, {uid: 2, vote: -2}]
// });
// userRef.push({
//     ID: 20170001,
//     password: 'simon',
//     feed_uids: [0, 1, 4, 5, 6, 7],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 0, vote: 0}, {uid: 2, vote: -1}, {uid: 3, vote: -2}]
// });
// userRef.push({
//     ID: 20170002,
//     password: 'sanni',
//     feed_uids: [0, 1, 2, 3, 6, 7],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 0, vote: 0}, {uid: 4, vote: -2}, {uid: 5, vote: -1}]
// });

// userRef.push({
//     ID: 0,
//     password: 'TA',
//     feed_uids: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 0, vote: 0}]
// });