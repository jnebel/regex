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
            return state.type === StateType.Final;
        });
    }

    public clear() : void
    {
        this.s = [];
    }
}

export function match(start: State, test: string): boolean
{
    var id = new IdGenerator();
    let cList = startlist(start, new List(), id);
    let nList = new List();
    
    test.split("").forEach((character) => {

        step(cList, character, nList, id);
        let t = cList;
        cList = nList;
        nList = t;

    });

    return cList.isMatch();
}

function addstate(l: List, s: State, id: IdGenerator)
{
    if(s === null || s.lastlist === id.get())
    {
        return;
    }
    s.lastlist = id.get();
    if(s.type === StateType.Split)
    {
        s.out.forEach((outState) => {
            addstate(l, outState, id);
        });
        return;
    }
    l.s.push(s);
}

function startlist(s: State, l: List, id: IdGenerator)
{
    id.increment();
    l.clear();
    addstate(l, s, id);
    return l;
}

function step(clist: List, character :string, nlist: List, id: IdGenerator)
{
    id.increment();
    nlist.clear();
    clist.s.forEach((state) => {

        if(state.type === StateType.Matcher && state.matcherFn(character))
        {
            state.out.forEach((outstate) => {
                addstate(nlist, outstate, id);
            });
        }

    });
}