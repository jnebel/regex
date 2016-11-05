import {Split, Match, State} from "./State";

class Frag
{
    constructor(public start: State, public end: State[]){
    }

    public patch(input: State)
    {
        this.end.forEach((outState) => {
            outState.out.push(input);
        });
    }
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
                e1.patch(e2.start);
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
                e.patch(state);
                stack.unshift(new Frag(state, [state]));
                break;
            case "+":
                e = stack.shift();
                state = new State(Split, [e.start]);
                e.patch(state);
                stack.unshift(new Frag(e.start, [state]));
                break;
            default:
                state = new State(character.charCodeAt(0), []);
                stack.unshift(new Frag(state, [state]));
                break;
        }
      
    });
      let e = stack.shift();
      e.patch(new State(Match, []))
      return e.start;
}