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
    private steps : State[][];
    private currentStep: number; 
    private id: IdGenerator;

    public static Start(startState: State) : Executor
    {
        var list = new Executor();
        list.addToStep(startState, 0);
        return list;
    }

    private constructor()
    {
     this.steps = [];
     this.currentStep = 0;
     this.id = new IdGenerator();
    }

    public currentStepContainsFinal() : boolean
    {
        return this.safeGetStep(this.currentStep).some((state) => {
            return state.type === StateType.Final;
        });
    }

    public generateNextStep(character: string) : void
    {
        this.id.increment();
        this.steps[this.currentStep].forEach((state) => {
            if(state.type === StateType.Matcher && state.matcherFn(character))
            {
                state.out.forEach((outstate) => {
                    this.addToStep(outstate, this.currentStep+1);
                });
            }
        });
        this.currentStep++;
    }

    private safeGetStep(step: number) : State[]
    {
        if(typeof this.steps[step] === "undefined") this.steps[step] = [];
        return this.steps[step];
    }

    private addToStep(s: State, step: number) : void
    {
        if(s === null || s.lastlist == this.id.get())
        {
            return;
        }
        s.lastlist = this.id.get();
        if(s.type === StateType.Split)
        {
            s.out.forEach((outState) => {
                this.addToStep(outState, step);
            });
        }
        this.safeGetStep(step).push(s);
    }
}

export function match(start: State, test: string): boolean
{
    let executor = Executor.Start(start);

    test.split("").forEach((character) => {
        executor.generateNextStep(character);
    });

    return executor.currentStepContainsFinal();
}
