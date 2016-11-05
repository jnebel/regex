var Split = 256;
var Match = 257;

class State
{
    public lastlist: number;

    constructor(public c: number, public out: State, public out1: State){}
}

class Frag
{
    constructor(public start: State, public end: State[]){}
}

function patch(outs: State[], input: State)
{
    outs.forEach((outState) => {
        outState.out = input;
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
                state = new State(Split, e1.start, e2.start);
                stack.unshift(new Frag(state, e1.out.concat(e2.out)));
            case ".":
                e2 = stack.shift();
                e1 = stack.shift();
                patch(e1.end, e2.start);
                stack.unshift(new Frag(e1.start, e2.end));
                break;
            case "?":
                e = stack.shift();
                state = new State(Split, e.start, null);
                stack.unshift(new Frag(state, e.out.concat(state.out1)));
            case "*":
                e = stack.shift();
                state = new State(Split, e.start, null);
                patch(e.end, state);
                stack.unshift(new Frag(state, [state.out1]));
            case "+":
                e = stack.shift();
                state = new State(Split, e.start, null);
                patch(e.end, state);
                stack.unshift(new Frag(e.start, [state.out1]));
            default:
                state = new State(character.charCodeAt(0),null,null);
                stack.unshift(new Frag(state, [state]));
                break;
        }
      
    });
      let e = stack.shift();
      patch(e.end, new State(Match, null, null));
      return e.start;
}