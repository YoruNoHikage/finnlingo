import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';

const md = new Remarkable('full', {
    breaks: true,
}).use(linkify);

@Decorators.vueComponent("lesson-editor")
class LessonEditorComponent
{
    $route: Route;
    $refs: { [ key: string ]: HTMLElement };
    $nextTick: Function;

    words: Word[] = [];
    sentences: Sentence[] = [];
    notes: string = "";
    editSentence: Sentence = null;

    currentCourse: Course = null;
    currentLesson: Lesson = null;
    selectedWord: Word = null;
    selectedSentence: Sentence = null;
    previewNotes: boolean = false;
    windowWidth = 1200;
    showTab = 'sentences';
    wordPictures = {};
    wordsForReuse = [];
    randomWordsForReuse = [];
    displayStatus = false;

    created() {
        this.windowWidth = document.documentElement.clientWidth;
        window.addEventListener('resize', e => {
            this.windowWidth = document.documentElement.clientWidth;
        });
        WordsApi.subscribeToWords(this.$route.params.lessonid);
        SentencesApi.subscribeToSentences(this.$route.params.lessonid);
        CoursesApi.subscribeToCourses(this.$route.params.courseid);

        Tracker.autorun(() => {
            const courses = Courses.find().fetch();
            if (courses[0]) {
                this.currentCourse = courses[0];

                for (const row of this.currentCourse.tree) {
                    const lesson = row.lessons.find(lesson => lesson.id === this.$route.params.lessonid)
                    if (lesson) {
                        this.currentLesson = lesson;
                        break;
                    }
                }
            }
            this.words = Words.find().fetch();
            this.sentences = Sentences.find({}, { sort: { order: 1 } }).fetch();
        });
        WordsApi.getWordPictures((err, res) => this.wordPictures = res);
        WordsApi.getWordsForReuse(this.$route.params.id, this.$route.params.lessonid, (err, res) => this.wordsForReuse = res);
    }

    mounted() {
        this.editSentence = null;
        this.selectedWord = null;
        this.selectedSentence = null;
        this.previewNotes = false;
        this.showTab = 'sentences';
        this.displayStatus = false;
    }

    updateWordsForReuse() {
        let allUsedWordsInLesson = [].concat.apply([], this.sentences.map(s => Utilities.sentenceToWords(s.text)));
        this.randomWordsForReuse = this.wordsForReuse.filter(w => allUsedWordsInLesson.indexOf(w.toLowerCase()) == -1).sort(() => .5 - Math.random()).slice(0, 10);
    }

    selectWord(word) {
        this.selectedWord = word;
        this.$nextTick(() => this.selectedSentence = null);
    }

    get lessonWords() {
        return this.words.filter(w => w.lessonId == this.$route.params.lessonid);
    }
    get lessonSentences() {
        return this.sentences.filter(w => w.lessonId == this.$route.params.lessonid);
    }

    get wordsCount() {
        return this.lessonWords.length;
    }
    get reusedCount() {
        return this.lessonSentences.reduce((r, s) => r + Object.keys(s.wordHints).filter(k => !this.lessonWords.some(w => w.inflections.some(i => i.text == k) || w.text == k)).length, 0);
    }
    get sentencesCount() {
        return this.lessonSentences.length;
    }
    get incompleteCount() {
        let incompleteWordsCount = this.lessonWords.filter(w => !w.translations.length).length;
        let incompleteSentencesCount = this.lessonSentences.filter(s => !s.translations.length).length;
        return incompleteWordsCount + incompleteSentencesCount;
    }

    get wordPicture() {
        return this.selectedWord.translations[0] && this.wordPictures[Utilities.getPictureId(this.selectedWord.translations[0].text)];
    }

    getWordClass(word) {
        var css = "";
        if (this.selectedWord && this.selectedWord._id == word._id)
            css += " selected";
        if (word.translations.length == 0)
            css += " warning";
        return css;
    }

    selectSentence(sentence) {
        this.selectedSentence = sentence;
    }

    getSentenceClass(sentence) {
        var css = "";
        if (this.selectedSentence && this.selectedSentence._id == sentence._id)
            css += " selected";
        if (sentence.translations && sentence.translations.length == 0)
            css += " warning";
        return css;
    }

    changeSentenceOrder(sentence, inc) {
        var index = this.sentences.indexOf(sentence);
        var savedOrder = this.sentences[index].order;
        if (inc > 0 && index < this.sentences.length -1) {
            this.sentences[index].order = this.sentences[index + 1].order;
            this.sentences[index + 1].order = savedOrder;
            SentencesApi.updateSentence(this.sentences[index + 1]);
        } else if (inc < 0 && index > 0) {
            this.sentences[index].order = this.sentences[index - 1].order;
            this.sentences[index - 1].order = savedOrder;
            SentencesApi.updateSentence(this.sentences[index - 1]);
        }
       // sentence.order += inc;
        SentencesApi.updateSentence(sentence);
    }

    startSentenceEditing(sentence) {
        this.editSentence = sentence;
        this.$nextTick(() => {
            this.$refs["editSentenceInput"].focus();
        });
    }

    removeTranslation(translation) {
        if (this.selectedWord && this.selectedWord.translations.indexOf(translation) > -1) {
            this.selectedWord.translations.splice(this.selectedWord.translations.indexOf(translation),1);
            WordsApi.updateWord(this.selectedWord);
        }
        else if (this.selectedWord && this.selectedWord.inflections.indexOf(translation) > -1) {
            this.selectedWord.inflections.splice(this.selectedWord.inflections.indexOf(translation),1);
            WordsApi.updateWord(this.selectedWord);
        }
        else if (this.selectedSentence && this.selectedSentence.translations.indexOf(translation) > -1) {
            this.selectedSentence.translations.splice(this.selectedSentence.translations.indexOf(translation),1);
            SentencesApi.updateSentence(this.selectedSentence);
        }
        else if (this.selectedSentence && this.selectedSentence.backTranslations.indexOf(translation) > -1) {
            this.selectedSentence.backTranslations.splice(this.selectedSentence.backTranslations.indexOf(translation),1);
            SentencesApi.updateSentence(this.selectedSentence);
        }
    }

    showThermometer() {
        this.displayStatus = true;
        this.updateWordsForReuse();
    }

    getSentenceNewTranslationText() {
        if (this.selectedSentence.testType == SentenceTestType.SelectMissingWord)
            return 'Add new choice';
        else
            return 'Add new translation';
    }

    saveNotes() {
        CoursesApi.updateCourse(this.currentCourse);
    }

    getLessonNotesPreview() {
        return md.render(this.currentLesson.notes);
    }

    selectWordPicture(picture: string) {
        this.selectedSentence.wordPicture = picture.match(/\/(.+)\.svg/)[1];
        SentencesApi.updateSentence(this.selectedSentence);
    }
}
this.LessonEditorComponent = LessonEditorComponent;