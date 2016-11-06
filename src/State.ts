export enum StateType
{
    Matcher,
    Split,
    Final,
}

export class State
{
    public lastlist: number;
    public matcherFn: (char: string) => boolean;

    constructor(public type: StateType, public out: State[] = []){
    }

    public static CreateFinalState()
    {
        return new State(StateType.Final);
    }

    public static CreateSplitState(...out: State[])
    {
        return new State(StateType.Split, out);
    }

    public static CreateCharacterMatcherState(char: String)
    {
       let state = new State(StateType.Matcher);
       state.matcherFn = function(testChar: string)
       {
           return char === testChar;
       }
       return state;
    }
}