import { State } from "./State";

class Frag {
    constructor(public start: State, public end: State[]) {
    }

    public patch(input: State) {
        this.end.forEach((outState) => {
            outState.out.push(input);
        });
    }
}

export function post2nfa(postfix: string): State {
    var stack = [] as Frag[];
    postfix.split("").forEach((character) => {
        switch (character) {
            case "|":
                createAlternationState(stack);
                break;
            case ".":
                createCatenationState(stack);
                break;
            case "?":
                createZeroOrOneState(stack);
                break;
            case "*":
                createZeroOrMoreState(stack);
                break;
            case "+":
                createOneOrMoreState(stack);
                break;
            default:
                createCharacterMatchState(stack, character);
                break;
        }

    });
    let e = stack.shift();
    e.patch(State.CreateFinalState());
    return e.start;
}

function createAlternationState(stack) {
    let e2 = stack.shift();
    let e1 = stack.shift();
    let state = State.CreateSplitState(e1.start, e2.start);
    stack.unshift(new Frag(state, e1.end.concat(e2.end)));
}

function createCatenationState(stack) {
    let e2 = stack.shift();
    let e1 = stack.shift();
    e1.patch(e2.start);
    stack.unshift(new Frag(e1.start, e2.end));
}

function createZeroOrOneState(stack) {
    let e = stack.shift();
    let state = State.CreateSplitState(e.start);
    stack.unshift(new Frag(state, e.end.concat(state)));
}

function createZeroOrMoreState(stack) {
    let e = stack.shift();
    let state = State.CreateSplitState(e.start);    
    e.patch(state);
    stack.unshift(new Frag(state, [state]));
}

function createOneOrMoreState(stack) {
    let e = stack.shift();
    let state = State.CreateSplitState(e.start);    
    e.patch(state);
    stack.unshift(new Frag(e.start, [state]));
}

function createCharacterMatchState(stack, character) {
    let state = State.CreateCharacterMatcherState(character);
    stack.unshift(new Frag(state, [state]));

}
