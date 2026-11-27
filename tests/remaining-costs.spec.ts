import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {operationalPanels,operationalEquations} from "../app/quantification/operational-data";
import {potentialAndCostEquations} from "../app/quantification/potential-financial";
import {solve,type Figures} from "../app/quantification/solver";
const run=(id:number,raw:Figures,options:Parameters<typeof potentialAndCostEquations>[2]={})=>{const c=configs.find(x=>x.id==="problem-"+id)!;const e=operationalEquations(operationalPanels(c,id===17?["negative-operational-less-staff-time-available-for-other-work"]:[]));return solve(c,raw,potentialAndCostEquations(c,e,options),{includeBounds:true});};
test("collection and financing forward and reverse",()=>{const r=run(22,{"fin:higher:collection-hours":"20","fin:average-collection-hour":"25","fin:higher:collection-fees":"100","fin:higher:borrowed":"10000","fin:higher:interest-rate":"12","fin:higher:borrowing-period":"365","fin:higher:financing-fees":"100"});expect(r.errors).toEqual([]);expect(r.values["fin:higher:collection"]).toBeCloseTo(600);expect(r.values["fin:higher:financing"]).toBeCloseTo(1300);});
test("wasted staff chain",()=>{const raw={"affected":"1200","averageMinutes":"6","op:less-staff-time-available-for-other-work:avoidable-percentage":"75","fin:avoidable-paid-share":"80","fin:average-staff-hour":"25"};const r=run(17,raw);expect(r.errors).toEqual([]);expect(r.values["fin:wasted-staff"]).toBeCloseTo(1800);const reverse=run(17,{...raw,affected:"","fin:wasted-staff":"1800"});expect(reverse.values.affected).toBeCloseTo(1200);});
test("complete wasted breakdown",()=>{const r=run(17,{"fin:wasted":"1000","fin:wasted-marketing":"400"},{wastedComplete:true});expect(r.bounds?.["fin:wasted-staff"]?.max).toBeCloseTo(600);});
