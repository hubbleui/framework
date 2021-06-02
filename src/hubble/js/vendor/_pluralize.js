/**
 * Pluralize
 * @see https://shopify.dev/docs/themes/ajax-api/reference/product-recommendations
 * 
 * @example Container.get('JSHelper').pluralize('tomato', 5);
 * 
 */
(function()
{
    /**
     * Pluralize a word.
     *
     * @param  string word  The input word
     * @param  int    count The amount of items (optional) (default 2)
     * @return string
     */
    var Pluralize = function(word, count)
    {
        /**
         * The word to convert.
         *
         * @var string
         */
        this.word = '';

        /**
         * Lowercase version of word.
         *
         * @var string
         */
        this.lowercase = '';

        /**
         * Uppercase version of word.
         *
         * @var string
         */
        this.upperCase = '';

        /**
         * Sentence-case version of word.
         *
         * @var string
         */
        this.sentenceCase = '';

        /**
         * Casing pattern of the provided word.
         *
         * @var string
         */
        this.casing = '';

        /**
         * Sibilants.
         *
         * @var array
         */
        this.sibilants = ['x', 's', 'z', 's'];

        /**
         * Vowels.
         *
         * @var array
         */
        this.vowels = ['a', 'e', 'i', 'o', 'u'];

        /**
         * Consonants.
         *
         * @var array
         */
        this.consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

        count = (typeof count === 'undefined' ? 2 : count);

        return this.convert(string, word, int);
    }

    /**
     * Pluralize a word.
     *
     * @param  string word  The input word
     * @param  int    count The amount of items (optional) (default 2)
     * @return string
     */
    Pluralize.prototype.convert = function(word, count)
    {
        // Return the word if we don't need to pluralize
        if (count === 1)
        {
            return word;
        }

        // Set class variables for use
        this.word = word;
        this.lowercase = strtolower(word);
        this.upperCase = strtoupper(word);
        this.sentenceCase = ucfirst(word);
        this.casing = this.getCasing();

        // save some time in the case that singular and plural are the same
        if (this.isUncountable())
        {
            return word;
        }

        // check for irregular forms
        irregular = this.isIrregular();
        if (irregular)
        {
            return this.toCasing(irregular, this.casing);
        }

        // nouns that end in -ch, x, s, z or s-like sounds require an es for the plural:
        if (in_array(this.suffix(this.lowercase, 1), this.sibilants) || (this.suffix(this.lowercase, 2) === 'ch'))
        {
            return this.toCasing(word + 'es', this.casing);
        }

        // Nouns that end in a vowel + y take the letter s:
        if (in_array(this.nthLast(this.lowercase, 1), this.vowels) && this.suffix(this.lowercase, 1) === 'y')
        {
            return this.toCasing(word + 's', this.casing);
        }

        // Nouns that end in a consonant + y drop the y and take ies:
        if (in_array(this.nthLast(this.lowercase, 1), this.consonants) && this.suffix(this.lowercase, 1) === 'y')
        {
            return this.toCasing(this.sliceFromEnd(word, 1) + 'ies', this.casing);
        }

        // Nouns that end in a consonant + o add s:
        if (in_array(this.nthLast(this.lowercase, 1), this.consonants) && this.suffix(this.lowercase, 1) === 'o')
        {
            return this.toCasing(word + 's', this.casing);
        }

        // Nouns that end in a vowel + o take the letter s:
        if (in_array(this.nthLast(this.lowercase, 1), this.vowels) && this.suffix(this.lowercase, 1) === 'o')
        {
            return this.toCasing(word + 's', this.casing);
        }

        // irregular suffixes that cant be pluralized
        if (this.suffix(this.lowercase, 4) === 'ness' || this.suffix(this.lowercase, 3) === 'ess')
        {
            return word;
        }

        // Lastly, change the word based on suffix rules
        pluralized = this.autoSuffix();

        if (pluralized)
        {
            return this.toCasing(this.sliceFromEnd(word, pluralized[0]) + pluralized[1], this.casing);
        }

        return this.word + 's';
    }

    /**
     * Is the word irregular and uncountable (e.g fish).
     *
     * @return bool
     */
    Pluralize.prototype.isUncountable = function()
    {
        var uncountable = [
            'gold',
            'audio',
            'police',
            'sheep',
            'fish',
            'deer',
            'series',
            'species',
            'money',
            'rice',
            'information',
            'equipment',
            'bison',
            'buffalo',
            'duck',
            'pike',
            'plankton',
            'salmon',
            'squid',
            'swine',
            'trout',
            'moose',
            'aircraft',
            'you',
            'pants',
            'shorts',
            'eyeglasses',
            'scissors',
            'offspring',
            'eries',
            'premises',
            'kudos',
            'corps',
            'heep',
        ];

        return in_array(this.lowercase, uncountable);
    }

    /**
     * Returns plural version of iregular words or FALSE if it is not irregular.
     *
     * @return string|bool
     */
    Pluralize.prototype.isIrregular = function()
    {
        var irregular = {
            'addendum': 'addenda',
            'alga': 'algae',
            'alumna': 'alumnae',
            'alumnus': 'alumni',
            'analysis': 'analyses',
            'antenna': 'antennae',
            'apparatus': 'apparatuses',
            'appendix': 'appendices',
            'axis': 'axes',
            'bacillus': 'bacilli',
            'bacterium': 'bacteria',
            'basis': 'bases',
            'beau': 'beaux',
            'kilo': 'kilos',
            'bureau': 'bureaus',
            'bus': 'buses',
            'cactus': 'cacti',
            'calf': 'calves',
            'child': 'children',
            'corps': 'corps',
            'corpus': 'corpora',
            'crisis': 'crises',
            'criterion': 'criteria',
            'curriculum': 'curricula',
            'datum': 'data',
            'deer': 'deer',
            'die': 'dice',
            'dwarf': 'dwarves',
            'diagnosis': 'diagnoses',
            'echo': 'echoes',
            'elf': 'elves',
            'ellipsis': 'ellipses',
            'embargo': 'embargoes',
            'emphasis': 'emphases',
            'erratum': 'errata',
            'fireman': 'firemen',
            'fish': 'fish',
            'fly': 'flies',
            'focus': 'focuses',
            'foot': 'feet',
            'formula': 'formulas',
            'fungus': 'fungi',
            'genus': 'genera',
            'goose': 'geese',
            'human': 'humans',
            'half': 'halves',
            'hero': 'heroes',
            'hippopotamus': 'hippopotami',
            'hoof': 'hooves',
            'hypothesis': 'hypotheses',
            'index': 'indices',
            'knife': 'knives',
            'leaf': 'leaves',
            'life': 'lives',
            'loaf': 'loaves',
            'louse': 'lice',
            'man': 'men',
            'matrix': 'matrices',
            'means': 'means',
            'medium': 'media',
            'memorandum': 'memoranda',
            'millennium': 'millenniums',
            'moose': 'moose',
            'mosquito': 'mosquitoes',
            'mouse': 'mice',
            'my': 'our',
            'nebula': 'nebulae',
            'neurosis': 'neuroses',
            'nucleus': 'nuclei',
            'neurosis': 'neuroses',
            'nucleus': 'nuclei',
            'oasis': 'oases',
            'octopus': 'octopi',
            'ovum': 'ova',
            'ox': 'oxen',
            'paralysis': 'paralyses',
            'parenthesis': 'parentheses',
            'person': 'people',
            'phenomenon': 'phenomena',
            'potato': 'potatoes',
            'quiz': 'quizzes',
            'radius': 'radii',
            'scarf': 'scarfs',
            'self': 'selves',
            'series': 'series',
            'sheep': 'sheep',
            'shelf': 'shelves',
            'scissors': 'scissors',
            'species': 'species',
            'stimulus': 'stimuli',
            'stratum': 'strata',
            'syllabus': 'syllabi',
            'symposium': 'symposia',
            'synthesis': 'syntheses',
            'synopsis': 'synopses',
            'tableau': 'tableaux',
            'that': 'those',
            'thesis': 'theses',
            'thief': 'thieves',
            'this': 'these',
            'tomato': 'tomatoes',
            'tooth': 'teeth',
            'torpedo': 'torpedoes',
            'vertebra': 'vertebrae',
            'veto': 'vetoes',
            'vita': 'vitae',
            'virus': 'viri',
            'watch': 'watches',
            'wife': 'wives',
            'wolf': 'wolves',
            'woman': 'women',
            'is': 'are',
            'was': 'were',
            'he': 'they',
            'she': 'they',
            'i': 'we',
            'zero': 'zeroes',
        };

        if (typeof irregular[this.lowercase] !== 'undefined')
        {
            return irregular[this.lowercase];
        }

        return false;
    }

    /**
     * Return an array with an index of where to cut off the ending and a suffix or FALSE.
     *
     * @return array|false
     */
    Pluralize.prototype.autoSuffix = function()
    {
        var suffix1 = this.suffix(this.lowercase, 1);
        var suffix2 = this.suffix(this.lowercase, 2);
        var suffix3 = this.suffix(this.lowercase, 3);

        if (this.suffix(this.lowercase, 4) === 'zoon') return [4, 'zoa'];

        if (suffix3 === 'eau') return [3, 'eaux'];
        if (suffix3 === 'ieu') return [3, 'ieux'];
        if (suffix3 === 'ion') return [3, 'ions'];
        if (suffix3 === 'oof') return [3, 'ooves'];

        if (suffix2 === 'an') return [2, 'en'];
        if (suffix2 === 'ch') return [2, 'ches'];
        if (suffix2 === 'en') return [2, 'ina'];
        if (suffix2 === 'ex') return [2, 'exes'];
        if (suffix2 === 'is') return [2, 'ises'];
        if (suffix2 === 'ix') return [2, 'ices'];
        if (suffix2 === 'nx') return [2, 'nges'];
        if (suffix2 === 'nx') return [2, 'nges'];
        if (suffix2 === 'fe') return [2, 'ves'];
        if (suffix2 === 'on') return [2, 'a'];
        if (suffix2 === 'sh') return [2, 'shes'];
        if (suffix2 === 'um') return [2, 'a'];
        if (suffix2 === 'us') return [2, 'i'];
        if (suffix2 === 'x') return [1, 'xes'];
        if (suffix2 === 'y') return [1, 'ies'];

        if (suffix1 === 'a') return [1, 'ae'];
        if (suffix1 === 'o') return [1, 'oes'];
        if (suffix1 === 'f') return [1, 'ves'];

        return false;
    }

    /**
     * Get provided casing of word.
     *
     * @return string
     */
    Pluralize.prototype.getCasing = function()
    {
        var casing = 'lower';
        casing = this.lowercase === this.word ? 'lower' : casing;
        casing = this.upperCase === this.word ? 'upper' : casing;
        casing = this.sentenceCase === this.word ? 'sentence' : casing;

        return casing;
    }

    /**
     * Convert word to a casing.
     *
     * @param  string word   The word to convert
     * @param  string casing The casing format to convert to
     * @return string
     */
    Pluralize.prototype.toCasing = function(word, casing)
    {
        if (casing === 'lower')
        {
            return word.toLowerCase();
        }
        elseif(casing === 'upper')
        {
            return word.toUpperCase();
        }
        elseif(casing === 'sentence')
        {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }

        return word;
    }

    /**
     * Strip end off a word at a given char index and return the end part.
     *
     * @param  string word  The word to convert
     * @param  int    count The index to split at
     * @return string
     */
    Pluralize.prototype.suffix = function(word, count)
    {
        return substr(word, word.length - count);
    }

    /**
     * Strip end off a word at a given char index and return the start part.
     *
     * @param  string word  The word to convert
     * @param  int    count The index to split at
     * @return string
     */
    Pluralize.prototype.sliceFromEnd = function(word, count)
    {
        return substr(word, 0, word.length - count);
    }

    /**
     * Get the nth last character of a string.
     *
     * @param  string word  The word to convert
     * @param  int    count The index to get
     * @return string
     */
    Pluralize.prototype.nthLast = function(word, count)
    {
        return word.split().reverse().join()[count];
    }

    Container.set('pluralize', Pluralize);

}());