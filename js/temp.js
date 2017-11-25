cardRef.once("value")
    .then(function(snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val().UID > 9) {
                childSnapshot.ref.remove()
            }
        })
        })