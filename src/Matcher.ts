import {StateType, State} from "./State";

class IdGenerator
{
    private currentId = 0;
    constructor(){}

    public get(){
        return this.currentId;
    }
    public increment(){
        this.currentId++; 
    }
}

class Executor
{
    public s : State[];
    public idGen: IdGenerator;

    constructor()
    {
     this.s = [];
    }

    public isMatch() : boolean
    {
        return this.s.some((state) => {
            return state.type === StateType.Final;
        });
    }

    public clear() : void
    {
        this.s = [];
    }

    public addState(s: State, id: IdGenerator) : void
    {
        if(s === null || s.lastlist == id.get())
        {
            return;
        }
        s.lastlist = id.get();
        if(s.type === StateType.Split)
        {
            s.out.forEach((outState) => {
                this.addState(outState, id);
            });
        }
        this.s.push(s);
    }

    public static Start(startState: State, id: IdGenerator) : Executor
    {
        id.increment();
        var list = new Executor();
        list.addState(startState, id);
        return list;
    }

   
    public step(character :string, id: IdGenerator) : Executor
    {
        var nList = new Executor();
        id.increment();
        this.s.forEach((state) => {

            if(state.type === StateType.Matcher && state.matcherFn(character))
            {
                state.out.forEach((outstate) => {
                    nList.addState(outstate, id);
                });
            }

        });
        return nList;
    }
}

export function match(start: State, test: string): boolean
{
    var id = new IdGenerator();
    let executor = Executor.Start(start, id);

    test.split("").forEach((character) => {
        executor = executor.step(character, id);
    });

    return executor.isMatch();
}
