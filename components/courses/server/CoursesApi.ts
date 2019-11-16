class CoursesApi {
    @Decorators.publish
    static subscribeToCourses(courseId?): Mongo.Cursor<Course> {
        var user = ACL.getUserOrThrow(this);
        if (courseId) {
            return Courses.find({ _id: courseId });
        }
        return Courses.find();
    }

    @Decorators.method
    static getSentencesCount(courseId, callback?) {
        let tree = Courses.findOne(courseId, { fields: { tree: 1 }}).tree;
        let lessonIds = [];
        for (let row of tree)
            lessonIds = lessonIds.concat(row.lessons.map(l => l.id));
        
        return Sentences.find({ lessonId: { $in: lessonIds }, testType: { $ne: SentenceTestType.Notes } }).count();
    }

    @Decorators.method
    static addCourse(name: string, callback?) {
        var user = ACL.getUserOrThrow(this);
        Courses.insert({
            name: name,
            tree: [],
            admin_ids: [user._id]
        });
    }

    @Decorators.method
    static updateCourse(courseModel, callback?) {
        var user = ACL.getUserOrThrow(this);
        Courses.update(
            { _id: courseModel._id, admin_ids: user._id }, 
            { $set: { name: courseModel.name, tree: courseModel.tree } }
        );
    }

    @Decorators.method
    static selectCourse(courseId, callback?) {
        var user = ACL.getUserOrThrow(this);
        Meteor.users.update(user._id, {
            $set: { selectedCourseId: courseId }
        });
    }

    @Decorators.method
    static downloadCourse(courseId, callback?) {
        var user = ACL.getUserOrThrow(this);

        const course = Courses.findOne(courseId);

        let lessonIds = [];
        for (let row of course.tree) {
            lessonIds = lessonIds.concat(row.lessons.map(l => l.id));
        }

        const sentences = Sentences.find({ lessonId: { $in: lessonIds } }).map(doc => doc);
        const words = Words.find({ lessonId: { $in: lessonIds } }).map(doc => doc);

        return {
            ...course,
            sentences,
            words,
        };
    }

    @Decorators.method
    static removeCourse(course, callback?) {
        var user = ACL.getUserOrThrow(this);
        Courses.remove(
            { _id: course._id, admin_ids: user._id }
        );
    }

}
this.CoursesApi = CoursesApi;