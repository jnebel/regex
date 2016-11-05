import {post2nfa} from './Compiler';
import {match} from './Matcher';

var tests = [
    { regex: "a+", test: "a", expected: true},
    { regex: "a+", test: "", expected: false},
    { regex: "a+", test: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", expected: true},
    { regex: "ab|", test: "a", expected: true},
    { regex: "ab|", test: "b", expected: true},
    { regex: "ab|", test: "c", expected: false},
    { regex: "ab|", test: "ab", expected: false},
    { regex: "ab|", test: "", expected: false},
    { regex: "a?", test: "", expected: true},
    { regex: "a?", test: "a", expected: true},
    { regex: "a?", test: "aa", expected: false},
    { regex: "a*", test: "", expected: true},
    { regex: "a*", test: "a", expected: true},
    { regex: "a*", test: "aa", expected: true},
    { regex: "ab.", test: "a", expected: false},
    { regex: "ab.", test: "b", expected: false},
    { regex: "ab.", test: "ab", expected: true},
    { regex: "ab.", test: "", expected: false},
    { regex: "abb.+.a.", test: "abba", expected: true },
    { regex: "abb.+.a.", test: "abbba", expected: false },
    { regex: "abb.+.a.", test: "abbbba", expected: true },
    { regex: "abb.+.a.", test: "abb", expected: false }
];

function testObjectMatches(testObject)
{
    let state = post2nfa(testObject.regex);
    testObject.result = match(state, testObject.test);
    return testObject;
}

var results = tests.map(testObjectMatches);
tests.forEach((testCase: any) => {

    var passed = testCase.result === testCase.expected;
    var failString = `Expected test case "${testCase.test}" for regex "${testCase.regex}" to be ${testCase.expected}, but it was ${testCase.result}`;

    console.assert(passed, failString);
});