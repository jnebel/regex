import {StateType, State} from "./State";

var listid = 0;
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
    let cList = startlist(start, new List());
    let nList = new List();
    
    test.split("").forEach((character) => {

        step(cList, character, nList);
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
    if(s.type === StateType.Split)
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

function step(clist: List, character :string, nlist: List)
{
    listid++;
    nlist.clear();
    clist.s.forEach((state) => {

        if(state.type === StateType.Matcher && state.matcherFn(character))
        {
            state.out.forEach((outstate) => {
                addstate(nlist, outstate);
            });
        }

    });
}