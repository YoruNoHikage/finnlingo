class DashboardApi {
    @Decorators.method
    static getDashboardPageData(callback?) {
        var user = ACL.getUserOrThrow(this);
        var today = new Date();
        today.setHours(0, 0, 0);
        var todayLeaders = Meteor.users.find(
            { "study.lastDateStudied": { $gte: today.getTime() } }, 
            { sort: { "study.lastDateXP": -1 }, limit: 10, fields: { "username": 1, "study.lastDateXP": 1 } })
            .fetch()
            .map(tl => ({ 
                username: tl.username,
                xp: tl.study ? tl.study.lastDateXP : 0,
            }));
        var allTimeLeaders = Meteor.users.find(
            { }, 
            { sort: { "study.xp": -1 }, limit: 10, fields: { "username": 1, "study.xp": 1 } })
            .fetch()
            .map(tl => ({ 
                username: tl.username,
                xp: tl.study ? tl.study.xp : 0,
            }));
        return {
            course: Courses.findOne(user.selectedCourseId),
            todayLeaders,
            allTimeLeaders,
        };
    }
}
this.DashboardApi = DashboardApi;