var Split = 256;
var Match = 257;
var listid = 0;

class State
{
    public lastlist: number;

    constructor(public c: number, public out: State[]){

        if(out === null) this.out = [];
    }
}

class Frag
{
    constructor(public start: State, public end: State[]){
    }
}

function patch(outs: State[], input: State)
{
    outs.forEach((outState) => {
        outState.out.push(input);
    });
}

function post2nfa(postfix: string) : State
{
    var stack = [] as Frag[];
    postfix.split("").forEach((character) => {
        let e1, e2, state, e;
        switch(character)
        {
            case "|":
                e2 = stack.shift();
                e1 = stack.shift();
                state = new State(Split, [e1.start, e2.start]);
                stack.unshift(new Frag(state, e1.end.concat(e2.end)));
                break;
            case ".":
                e2 = stack.shift();
                e1 = stack.shift();
                patch(e1.end, e2.start);
                stack.unshift(new Frag(e1.start, e2.end));
                break;
            case "?":
                e = stack.shift();
                state = new State(Split, [e.start]);
                stack.unshift(new Frag(state, e.end.concat(state)));
                break;
            case "*":
                e = stack.shift();
                state = new State(Split, [e.start]);
                patch(e.end, state);
                stack.unshift(new Frag(state, [state]));
                break;
            case "+":
                e = stack.shift();
                state = new State(Split, [e.start]);
                patch(e.end, state);
                stack.unshift(new Frag(e.start, [state]));
                break;
            default:
                state = new State(character.charCodeAt(0), []);
                stack.unshift(new Frag(state, [state]));
                break;
        }
      
    });
      let e = stack.shift();
      patch(e.end, new State(Match, []));
      return e.start;
}

class List
{
    public s : State[];

    constructor()
    {
     this.s = [];
    }

    public isMatch() : boolean
    {
        return this.s.some((state) => {
            return state.c === Match;
        });
    }

    public clear() : void
    {
        this.s = [];
    }
}

function match(start: State, test: string): boolean
{
    let cList = startlist(start, new List());
    let nList = new List();
    
    test.split("").forEach((character) => {

        step(cList, character.charCodeAt(0), nList);
        let t = cList;
        cList = nList;
        nList = t;

    });

    return cList.isMatch();
}

function addstate(l: List, s: State)
{
    if(s === null || s.lastlist === listid)
    {
        return;
    }
    s.lastlist = listid;
    if(s.c === Split)
    {
        s.out.forEach((outState) => {
            addstate(l, outState);
        });
        return;
    }
    l.s.push(s);
}

function startlist(s: State, l: List)
{
    listid++;
    l.clear();
    addstate(l, s);
    return l;
}

function step(clist: List, c: number, nlist: List)
{
    listid++;
    nlist.clear();
    clist.s.forEach((state) => {

        if(state.c === c)
        {
            state.out.forEach((outstate) => {
                addstate(nlist, outstate);
            });
        }

    });
}

function transformToGraph(testObject)
{   
    testObject.state = post2nfa(testObject.regex);
    return testObject;
}
function runTest(testObject)
{
    testObject.result = match(testObject.state, testObject.test);
    return testObject;
}

var tests = [
    { regex: "abb.+.a.", test: "abba", expected: true },
    { regex: "abb.+.a.", test: "abbba", expected: false },
    { regex: "abb.+.a.", test: "abbbba", expected: true },
    { regex: "abb.+.a.", test: "abb", expected: false },
    { regex: "a+", test: "a", expected: true},
    { regex: "a+", test: "", expected: false},
    { regex: "a+", test: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", expected: true},
    { regex: "ab|", test: "a", expected: true},
    { regex: "ab|", test: "b", expected: true},
    { regex: "ab|", test: "c", expected: false},
    { regex: "ab|", test: "ab", expected: false},
    { regex: "ab|", test: "", expected: false}
];
var results = tests.map(transformToGraph).map(runTest);
tests.forEach((testCase: any) => {

    var passed = testCase.result === testCase.expected;
    var failString = `Expected test case "${testCase.test}" for regex "${testCase.regex}" to be ${testCase.expected}, but it was ${testCase.result}`;

    console.assert(passed, failString);
});