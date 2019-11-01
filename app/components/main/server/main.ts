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

    Meteor.publish('userData', function() {
        return Meteor.users.find({ _id: this.userId }, { fields: { study: 1 } });
    });

});

