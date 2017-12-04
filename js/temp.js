// cardRef.once("value")
//     .then(function(snapshot) {
//         snapshot.forEach(function (childSnapshot) {
//             if (childSnapshot.val().UID > 9) {
//                 childSnapshot.ref.remove()
//             }
//         })
//         })


// userRef.push({
//     ID: 00,
//     password: 'TA',
//     feed_uids: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
//     my_posts_uids: [-1],
//     my_votes_uids: [{uid: 0, vote: 0}]
// });


// userRef.once("value")
//     .then(function (snapshot) {
//         snapshot.forEach(function (childSnapshot) {
//             if ((childSnapshot.val().ID == 20150950) || (childSnapshot.val().ID == 20176472)) {
//                 for (i = 8; i <= 15; i++) {
//                     console.log(i)
//                     add_feed_uid(i, childSnapshot.val().ID)
//                 }
//             }
//         })
//
//     })

// for indix in indices {
//     add_feed_uid(indix, 20150950)
// }

// $.each(indices, function( index, value ) {
//     add_feed_uid(index, 20150950)
// });

// add_feed_uid(9, 20150950)

// get author of the post

// function get_author(uid) {
//     userRef.once("value")
//     .then(function (snapshot) {
//         snapshot.forEach(function (childSnapshot) {
//             if (childSnapshot.val().my_posts_uids.includes(uid)) {
//                 console.log(childSnapshot.val().ID)
//             }
//         })
//     })
// }
//
// get_author(21)


// add flagged_uids to user_cards
// userRef.once("value")
//     .then(function (snapshot) {
//         snapshot.forEach(function (childSnapshot) {
//             if (childSnapshot.val().ID != 20150950) {
//                 childSnapshot.ref.update({flagged_uids: [-1]})
//             }
//         })
//     })

// cardRef.once("value")
//     .then(function(snapshot) {
//         snapshot.forEach(function (childSnapshot) {
//             childSnapshot.ref.update({flagged_users: [-1]})
//         })
//     })