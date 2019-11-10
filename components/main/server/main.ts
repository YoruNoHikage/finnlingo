Meteor.startup(() => {

    ServiceConfiguration.configurations.upsert(
        { service: 'github' },
        {
            $set: {
                loginStyle: "redirect",
                clientId: process.env.GITHUB_APP_ID,
                secret: process.env.GITHUB_APP_SECRET
            }
        }
    );

    Accounts.onCreateUser((options, user) => {
        if (user.services.github) {
            user.username = user.services.github.username.toLowerCase();
        }

        if (options.profile) {
          user.profile = options.profile;
        }

        const courses = Courses.find().fetch();

        user.selectedCourseId = courses[0] ? courses[0]._id : null;
        user.study = {
            dailyGoal: 20,
            daysStudied: 0,
            lastDateStudied: null,
            lastDateXP: null,
            streakDays: 0,
            streakLastDate: null,
            xp: 0,
            completedLessonIds: [],
            learnedWords: [],
        };

        return user;
    });


    Meteor.publish('userData', function() {
        return Meteor.users.find({ _id: this.userId }, { fields: { study: 1, username: 1 } });
    });

});

