@Decorators.vueComponent("courses")
class CoursesComponent
{
    $route: Route;
    $router: VueRouter;
    $set: Function;

    courses: Course[] = null;
    course: Course = null;
    loggingIn: boolean = true;
    user: User = null;
    sentencesCount: { [key: string]: number } = {};

    created() {
        CoursesApi.subscribeToCourses();
        Tracker.autorun(() => {
            this.loggingIn = Meteor.loggingIn();
            this.user = Meteor.user();
            this.courses = Courses.find().fetch();
            if (this.$route.params.id)
                this.course = this.courses.filter(c => c._id == this.$route.params.id)[0];

            for (let c of this.courses) {
                CoursesApi.getSentencesCount(c._id, (err, count) => {
                    this.sentencesCount[c._id] = count;
                    this.courses = this.courses.sort((a, b) => this.sentencesCount[b._id] - this.sentencesCount[a._id]);
                });
            }

        })
    }

    selectCourse(course) {
        CoursesApi.selectCourse(course._id, (err, res) => {
            if (!err)
                this.$router.push("/");
            else
                alert("Error occured: " + err);
        });
    }

    downloadCourse(course) {
        CoursesApi.downloadCourse(course._id, (err, res) => {
            if (!err) {
                const a = document.createElement("a");

                document.body.appendChild(a);

                a.style.display = "none";

                const blob = new Blob([JSON.stringify(res)], {type: "application/json"});
                const url = window.URL.createObjectURL(blob);

                a.href = url;
                a.download = course._id + '.json';
                a.click();
                window.URL.revokeObjectURL(url);

                document.body.removeChild(a);
            }
            else
                alert("Error occured: " + err);
        });
    }

    canAdd() {
        return this.user.username === 'yorunohikage';
    }

    canEdit(course) {
        return course.admin_ids.indexOf(this.user._id) > -1;
    }

    editCourse(course) {
        this.course = this.courses.filter(c => c._id == course._id)[0];
        this.$router.push("/courses/" + course._id);
    }

}
this.CoursesComponent = CoursesComponent;