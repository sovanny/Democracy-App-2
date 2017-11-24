// Initialize Firebase
var config = {
    apiKey: "AIzaSyAlgtMKytcxjYYTxjIGiDgUEUm5yVOf3X0",
    authDomain: "democracy-app-2.firebaseapp.com",
    databaseURL: "https://democracy-app-2.firebaseio.com",
    projectId: "democracy-app-2",
    storageBucket: "democracy-app-2.appspot.com",
    messagingSenderId: "895134222441"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

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
        loadCardContent($('#feed-container'), listOfUids);


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
        if ($button.hasClass(agreedClass)) {
            $button.removeClass(agreedClass);
            $button.addClass(notClickedClass);
            var cardUid = parseInt($button.closest("div .card").prop("id"));
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().agree_count;
                            if (old_count == 99) {
                                $("#" + cardUid).addClass('in-progress')
                            }

                            childSnapshot.ref.update({agree_count: old_count - 1});
                            childSnapshot.ref.update({my_count: 0});

                        }
                    })
                });

            database.ref('my_votes_uids').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            childSnapshot.ref.remove();

                        }
                    })
                });
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            database.ref('feed_uids').push({"UID": childSnapshot.val().UID});

                        }
                    })
                });
        } else {
            $button.removeClass(notClickedClass);
            $button.addClass(agreedClass);


            var cardUid = parseInt($button.closest("div .card").prop("id"));
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().agree_count;

                            childSnapshot.ref.update({agree_count: old_count + 1});
                            childSnapshot.ref.update({my_count: 1});

                        }
                    })
                });

            database.ref('feed_uids').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            childSnapshot.ref.remove();

                        }
                    })
                });

            database.ref('my_votes_uids').push({"UID": cardUid});
        }

    }

    function disAgree($button) {
        const disagreedClass = 'disagreed';
        const notClickedClass = 'notClicked';
        if ($button.hasClass(disagreedClass)) {
            $button.removeClass(disagreedClass);
            $button.addClass(notClickedClass);
            var cardUid = parseInt($button.closest("div .card").prop("id"));
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().disagree_count;

                            childSnapshot.ref.update({disagree_count: old_count - 1});
                            childSnapshot.ref.update({my_count: 0});

                        }
                    })
                });

            database.ref('my_votes_uids').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            childSnapshot.ref.remove();

                        }
                    })
                });
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            database.ref('feed_uids').push({"UID": childSnapshot.val().UID});

                        }
                    })
                });
        } else {
            $button.removeClass(notClickedClass);
            $button.addClass(disagreedClass);


            var cardUid = parseInt($button.closest("div .card").prop("id"));
            database.ref('cards').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {

                            var old_count = childSnapshot.val().disagree_count;

                            childSnapshot.ref.update({disagree_count: old_count + 1});
                            childSnapshot.ref.update({my_count: -1});

                        }
                    })
                });

            database.ref('feed_uids').once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().UID == cardUid) {
                            childSnapshot.ref.remove();

                        }
                    })
                });

            database.ref('my_votes_uids').push({"UID": cardUid});
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
            loadCardContent($view, listOfUids);
        }
        else if ($tab.hasClass('my-votes-view')) {
            var listOfUids = getUidList('my_votes_uids');
            loadCardContent($view, listOfUids);
        }
        else if ($tab.hasClass('my-posts-view')) {

            var listOfUids = getUidList('my_posts_uids');
            loadCardContent($view, listOfUids);
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
    function loadCardContent($view, uidList) {

        // empty the current content
        $view.empty();

        var cardContent = database.ref('cards');


        /* Checks for newly added cards
        cardContent.on('child_added', function (snapshot) {
            var data = snapshot.val();
        });*/


        cardContent.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    card = childSnapshot.val()
                    if (uidList.indexOf(card.UID) > -1) {

                        var agreedClass = 'notClicked';
                        var disagreedClass = "notClicked";

                        if (card.my_count == -1) {
                            disagreedClass = "disagreed";
                        } else if (card.my_count == 1) {
                            agreedClass = "agreed";
                        }

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
        var myPostsListRef = database.ref(nameOfList);

        myPostsListRef.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    listOfUids.push(childSnapshot.val().UID)
                })
            })
        return listOfUids;
    }

});





