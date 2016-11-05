import {Split, Match, State} from "./State";

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
            return state.c === Match;
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