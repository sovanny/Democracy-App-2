## KAI'STEER
A platform for expressing opinions and raising issues on campus, in order to gain support and make a change.

The application is made for mobile as it is now.

The main features are in /js/main.js. There are functions such as `agree()` and `disagree()` which are activated when the user votes on a post. The functions updates the counts in the database. They, in turn call on a few other key functions such as `add_feed_uid()` and `remove_feed_uid()` that handles the which posts the particular logged in user has voted on.