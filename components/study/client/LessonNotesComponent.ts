@Decorators.vueComponent('notes')
class LessonNotesComponent {
    $route: Route;

    lesson: Lesson = null;

    created() {
        StudyApi.getLesson(this.$route.params.courseid, this.$route.params.lessonid, (err, result) => {
            if (err) {
                alert(err);
                return;
            }
            this.lesson = result;
        });
    }

}
this.LessonNotesComponent = LessonNotesComponent;