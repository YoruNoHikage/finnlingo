import LessonNotesComponent from '../../study/client/LessonNotesComponent';

Meteor.startup(() => {

    var router = new VueRouter({
        mode: 'history',
        routes: [
            { path: '/', component: new DashboardComponent() },
            { path: '/login', component: new LoginComponent() },
            { path: '/study/:courseid/lessons/:lessonid', component: new StudyComponent() },
            { path: '/study/:courseid/lessons/:lessonid/notes', component: new LessonNotesComponent() },
            { path: '/courses', component: new CoursesComponent() },
            { path: '/courses/:id', component: new CoursesComponent() },
            { path: '/courses/:id/lessons/:lessonid', component: new LessonEditorComponent() }
        ]
    });

    router.beforeEach((to, from, next) => {
        Tracker.autorun(() => {
            if (!Meteor.loggingIn()) {
                if (Meteor.user() && to.path == '/login')
                    next('/');
                else if (Meteor.user())
                    next();
                else if (to.path == '/login')
                    next();
                else
                    next('/login');
            }
        });
    });

    new TopBarComponent();
    new ListEditorComponent();
    new CourseTreeComponent();
    new LessonEditorComponent();

    new Vue({
        el: '#app',
        router: router
    });

    Meteor.subscribe('userData');

});