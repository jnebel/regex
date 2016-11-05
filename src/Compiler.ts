var Split = 256;
var Match = 257;

export class State
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

export function post2nfa(postfix: string) : State
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