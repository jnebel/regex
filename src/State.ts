var Split = 256;
var Match = 257;

export {Split, Match};
export class State
{
    public lastlist: number;

    constructor(public c: number, public out: State[]){
        if(out === null) this.out = [];
    }
}