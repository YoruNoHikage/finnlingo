# Finnlingo

Duolingo-like application for learning Finnish (work in progress).

Application was created because Finnish was not being accepted to Duolingo Incubator for a very long time despite of having a lot of contributors.

See more details in the "Finnish on Duolingo" Facebook group: https://www.facebook.com/groups/finnishonduolingo/

## Contributing

Development can be done on Mac, Windows or Linux.

App is created with Vue.js and Meteor.js using TypeScript.
Application code is found under /app/components and /app/lib. Database structure described in /app/lib/Db.ts.

1. [Install Meteor](https://www.meteor.com/install)
2. Fork
3. `git clone https://github.com/<your username>/finnlingo.git`
4. `meteor npm install`
5. `meteor`
6. If everything is fine, the app should be accessible at http://localhost:3000

App uses Facebook authentication.

For development, please create your own FB app at https://developers.facebook.com and put app id and secret into /app/components/main/server/main.ts.

Do not commit your FB app id and secret! You can use `git update-index --assume-unchanged /app/components/main/server/main.ts`.

## Screenshots

![Dashboard](https://raw.github.com/andrei-markeev/finnlingo/master/screenshots/dashboard.png)

![Lesson practice](https://raw.github.com/andrei-markeev/finnlingo/master/screenshots/study.png)

![Lesson completed](https://raw.github.com/andrei-markeev/finnlingo/master/screenshots/study2.png)

![Course editor](https://raw.github.com/andrei-markeev/finnlingo/master/screenshots/course-editor.png)

![Lesson editor](https://raw.github.com/andrei-markeev/finnlingo/master/screenshots/lesson-editor.png)

