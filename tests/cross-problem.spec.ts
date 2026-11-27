import {test,expect} from "@playwright/test";
import {configs} from "../app/quantification/config";
import {solveAcrossProblems,type SharingLink} from "../app/quantification/cross-problem";
const cs=configs.filter(c=>["problem-1","problem-2"].includes(c.id));
const link:SharingLink={left:"problem-1/affected",right:"problem-2/affected",kind:"subset",scopeConfirmed:true};
test("optional containment flows both directions and clears when disabled",()=>{
 const a=solveAcrossProblems(cs,{"problem-2":{affected:"30"}},{},{},{},[link]);
 expect(a["problem-1"].bounds?.affected?.min).toBe(30);
 const b=solveAcrossProblems(cs,{"problem-1":{affected:"100"}},{},{},{},[link]);
 expect(b["problem-2"].bounds?.affected?.max).toBe(100);
 const c=solveAcrossProblems(cs,{"problem-2":{affected:"30"}},{},{},{},[]);
 expect(c["problem-1"].bounds?.affected?.min).toBe(0);
});
