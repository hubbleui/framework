/**
 * JS beautifier task
 *
 * @var object
 */
module.exports =
{
    files : ["src/hubble/js/**/*.js", "src/theme/js/**/*.js"],
    options :
    {
        js:
        {
            braceStyle: "expand",
            breakChainedMethods: false,
            e4x: false,
            evalCode: false,
            indentChar: " ",
            indentLevel: 0,
            indentSize: 4,
            indentWithTabs: false,
            jslintHappy: false,
            keepArrayIndentation: false,
            keepFunctionIndentation: false,
            maxPreserveNewlines: 5,
            preserveNewlines: true,
            spaceBeforeConditional: true,
            spaceInParen: false,
            unescapeStrings: false,
            wrapLineLength: 0,
            endWithNewline: true
        }
    }
};
