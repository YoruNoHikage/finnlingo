var Decorators = this.Decorators || {};

class Utilities {
    static sentenceToWords(s: string) {
        var sentence = s.split(/[,\.\-\?!:\s"]+/).join(' ').trim().toLowerCase();

        return sentence.split(' ');
    }

    static getSentenceTokens(text, dictionary) {
        if (!dictionary) {
            return text.split(/([,\.\-\?!:\s"])/g);
        }

        return text.split(/([,\.\?!:\s"])/g).map(word => {
            if (word.includes('-') && word.split('-').some(w => dictionary[w])) {
                return word.split(/(\-)/g);
            }
            return word;
        }).flat();
    }

    static getPictureId(text) {
        return text.replace(/^(the\s+|a\s+|an\s+)/,'').replace(/ /g,'-');
    }
}
this.Utilities = Utilities;
