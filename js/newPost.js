var userRef = database.ref("users")
var cardRef = database.ref("cards")
var next_uidRef = database.ref("next_uid")
var next_uid = 0;

/*
    get the uid to be assigned to the post about to be created
 */
next_uidRef.once("value")
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            next_uid = childSnapshot.val();
        })})

$(document).ready(function(){
    $('#feed-container').on('click', '#postBtn', function(e){
        userRef.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().ID == currentUser) {
                        var old_post_count = 0;
                        var new_post_count = 0;
                        var d = new Date();
                        var url = "";
                        var date = "";
                        var title = "";
                        var details = "";

                        // if haven't posted too many times yet
                       if (childSnapshot.val().post_count != 3) {
                           old_post_count = childSnapshot.val().post_count
                           new_post_count = old_post_count + 1;
                           childSnapshot.ref.update({post_count: new_post_count})
                            title = document.getElementById("title").value;
                            details = document.getElementById("details").value
                            date = d.toISOString();
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
                                flagged_users: [-1],
                            });

                            // also add this UIDs to my_posts
                            add_my_post_uid(next_uid)

                            // add the post to everyone's feed
                            add_new_post_to_feed(next_uid)

                            next_uidRef.once("value")
                                .then(function (snapshot) {
                                    snapshot.forEach(function (childSnapshot) {
                                        snapshot.ref.update({next_uid: next_uid + 1})
                                        next_uid += 1;
                                    })
                                })

                            const $view = $('#feed-container')

                            setTimeout(function () {
                                var listOfUids2 = getUidList("my_posts_uids")
                                loadCardContent($view, listOfUids2);
                                // A variable for the tabs
                                const $tabs = $('#bottom-navbar .tab')
                                // Run selectTab and loadCardContent once in order to show something upon loading
                                selectTab($tabs, $($tabs[2]))
                            }, 1500);
                        // if posted too > 3 times
                        } else {
                           showSnackbarNewPost();
                           console.log("you've posted too many posts, please come tomorrow")
                       }
                    }
                })
            })


    })

});


/* Describes the behavior of the tab bar at the bottom of the screen with respect to classes assigned to different elements
   @param: tabs, tab
   @return: none
*/
function selectTab($tabs, $tab) {
    const selectedClass = 'selected';
    $tabs.removeClass(selectedClass);
    $tabs.children().removeClass(selectedClass);

    $tab.addClass(selectedClass);
    $tab.children().addClass(selectedClass);
}


/* Make an element "snackbarNewPost" visible
   @param: none
   @return: none
*/
function showSnackbarNewPost(){
    var x = document.getElementById("snackbarNewPost")
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}




