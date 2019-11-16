import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';

const md = new Remarkable('full', {
    breaks: true,
}).use(linkify);

@Decorators.vueComponent('notes')
export default class LessonNotesComponent {
    $route: Route;

    name: string = '';
    notes: string = '';

    created() {
        StudyApi.getLesson(this.$route.params.courseid, this.$route.params.lessonid, (err, result) => {
            if (err) {
                alert(err);
                return;
            }
            this.name = result.name;
            this.notes = result.notes;
        });
    }

    getLessonNotes() {
        return md.render(this.notes);
    }
}
