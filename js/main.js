// When site had loaded
$(window).on("load", function () {

    //Run main function
    start();

    function start() {

        var $tabs, listOfUids;

        // A variable for the tabs
        $tabs = $('#bottom-navbar .tab');
        $tabs.push($('.tab-child'))

        // Run selectTab and loadCardContent once in order to show something upon loading
        selectTab($tabs, $($tabs[0]))


        listOfUids = getUidList('feed_uids');
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
        })
        // when clicking on X
        $('#feed-container').on('click', '.fa-times', function (e) {
            disAgree($(e.target));
        })
        // when clicking on flag
        $('#feed-container').on('click', '.fa-flag', function (e) {
            flagPost($(e.target));

        })

    }

    /* Describes the behavior of the tab bar at the bottom of the screen with respect to classes assigned to different elements
       @param: tabs, tab
       @return: none
    */
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


    /* Describes the behavior of the tab bar at the bottom of the screen (specifically, on-click behaviour of each tab)
       @param: tab
       @return: none
    */
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
            loadCardContent($view, listOfUids, 'votes');
        }
        else if ($tab.hasClass('my-posts-view')) {

            var listOfUids = getUidList('my_posts_uids');
            loadCardContent($view, listOfUids, 'my_posts');
        }
        else if ($tab.hasClass('new-post-view')) {
            loadHtml($view, '../html/newPost');
        }
    }

    /* Append a given html file to the view, without reloading the page.
       @param: view, an html filename
       @return: none
    */
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
});
