import { problems, problemCategories } from "../discovery/data";

export const sectionOrder = ["Quantity", "Time", "Frequency", "Comparison", "Money"] as const;
export type Section = typeof sectionOrder[number];
export type Field = { key: string; label: string; unit: string; general?: boolean };
export type Config = { id: string; name: string; category: string; fields: Record<Section, Field[]>; timePopulation?: string; actualKey?: string; moneyPopulation?: string; example: Record<string,string>; reference: "screenshot" | "prior-discussion" | "reconstructed" };
type Spec = { total: string; affected: string; unaffected: string; rate: string; sections?: Section[]; time?: "affected" | "recorded" | "staff"; actual?: string; actualKey?: string; compareUnit?: string; target?: string; money?: [string,string]; reference?: Config["reference"]; unit?: string };
// Labels and applicability not visible in the recovered reference are provisional reconstructions.
// Time always includes the separate duration in months.
const specs: Record<string, Spec> = {
  "problem-1": {total:"Total incoming calls",affected:"Missed calls",unaffected:"Answered calls",rate:"Missed call rate",reference:"prior-discussion"},
  "problem-2": {total:"Calls outside working hours",affected:"Unanswered calls outside working hours",unaffected:"Answered calls outside working hours",rate:"Unanswered call rate"},
  "problem-3": {total:"Calls requiring appointments",affected:"Missed bookings during calls",unaffected:"Bookings completed during calls",rate:"Missed booking rate"},
  "problem-4": {total:"Urgent calls",affected:"Urgent calls not reaching employees",unaffected:"Urgent calls reaching employees",rate:"Unrouted urgent call rate"},
  "problem-5": {total:"New leads requiring a response",affected:"New leads with slow responses",unaffected:"New leads with timely responses",rate:"Slow response rate",sections:["Quantity","Time","Comparison"],time:"recorded",actual:"Average response time",actualKey:"averageMinutes",compareUnit:"min",reference:"prior-discussion"},
  "problem-6": {total:"New leads requiring calls",affected:"New leads never called",unaffected:"New leads called",rate:"Uncalled lead rate",reference:"screenshot"},
  "problem-7": {total:"Leads requiring qualification",affected:"Late lead qualifications",unaffected:"Timely lead qualifications",rate:"Late qualification rate",time:"recorded",actual:"Average qualification time",actualKey:"averageMinutes",compareUnit:"min"},
  "problem-8": {total:"Warm leads requiring contact",affected:"Warm leads not contacted",unaffected:"Warm leads contacted",rate:"Uncontacted warm lead rate"},
  "problem-9": {total:"Old leads requiring calls",affected:"Old leads not called",unaffected:"Old leads called",rate:"Uncalled old lead rate"},
  "problem-10": {total:"Old leads requiring follow-up",affected:"Old leads followed up inconsistently",unaffected:"Old leads followed up regularly",rate:"Inconsistent follow-up rate"},
  "problem-11": {total:"Warm old leads requiring further contact",affected:"Warm old leads not contacted again",unaffected:"Warm old leads contacted again",rate:"Uncontacted warm old lead rate"},
  "problem-12": {total:"Appointments requiring reminders",affected:"Missed appointment reminders",unaffected:"Appointment reminders sent",rate:"Missed reminder rate"},
  "problem-13": {total:"Appointments requiring confirmation",affected:"Unconfirmed appointments",unaffected:"Confirmed appointments",rate:"Unconfirmed appointment rate"},
  "problem-14": {total:"Scheduled appointments",affected:"Appointment no-shows",unaffected:"Appointments attended",rate:"No-show rate",reference:"prior-discussion"},
  "problem-15": {total:"Appointments requiring rescheduling",affected:"Time-consuming appointment rescheduling",unaffected:"Appointments rescheduled promptly",rate:"Time-consuming rescheduling rate",time:"affected",actual:"Average time per unit",actualKey:"averageMinutes",compareUnit:"min"},
  "problem-16": {total:"Canceled appointment slots",affected:"Empty slots after cancellations",unaffected:"Canceled slots filled",rate:"Unused slot rate"},
  "problem-17": {total:"Questions received",affected:"Routine questions",unaffected:"Other questions",rate:"Routine question rate",time:"affected",actual:"Total employee time",actualKey:"hours",compareUnit:"hrs"},
  "problem-18": {total:"Simple questions received",affected:"Simple questions answered slowly",unaffected:"Simple questions answered promptly",rate:"Slow answer rate",time:"recorded",actual:"Average response time",actualKey:"averageMinutes",compareUnit:"min"},
  "problem-19": {total:"Questions answered by employees",affected:"Repeated questions answered by employees",unaffected:"Other questions answered by employees",rate:"Repeated question rate",time:"affected",actual:"Total employee time",actualKey:"hours",compareUnit:"hrs"},
  "problem-20": {total:"Total tasks",affected:"Tasks completed manually",unaffected:"Tasks not completed manually",rate:"Manual task rate",time:"affected",actual:"Total staff time",actualKey:"hours",compareUnit:"hrs",reference:"screenshot"},
  "problem-21": {total:"Basic buyer requests",affected:"Basic buyer requests not handled",unaffected:"Basic buyer requests handled",rate:"Unhandled request rate"},
  "problem-22": {total:"Payments requiring reminders",affected:"Missed payment reminders",unaffected:"Payment reminders sent",rate:"Missed payment reminder rate",money:["Total amount of payments without reminders","Average payment amount"]},
  "problem-23": {total:"Invoices requiring follow-up",affected:"Invoices not followed up regularly",unaffected:"Invoices followed up regularly",rate:"Inconsistent invoice follow-up rate",money:["Total amount of affected invoices","Average amount per invoice"],reference:"prior-discussion"},
  "problem-24": {total:"Buyers eligible for review requests",affected:"Buyers not asked for reviews",unaffected:"Buyers asked for reviews",rate:"Missed review request rate"},
  "problem-25": {total:"Calls requiring recordings and outcomes",affected:"Calls with missing recordings or outcomes",unaffected:"Calls with recordings and outcomes",rate:"Missing record rate"},
  "problem-26": {total:"Lead records requiring CRM updates",affected:"Lead details not updated in CRM",unaffected:"Lead details updated in CRM",rate:"Missing update rate"},
  "problem-27": {total:"Agent activities requiring visibility",affected:"Agent activities not visible",unaffected:"Agent activities visible",rate:"Missing activity rate"},
  "problem-28": {total:"Total tasks",affected:"Tasks affected by employee overload",unaffected:"Tasks not affected by employee overload",rate:"Affected task rate",time:"staff",actual:"Required staff hours",actualKey:"hours",compareUnit:"hrs",target:"Available staff hours"},
};
const field=(key:string,label:string,unit:string,general=false):Field=>({key,label,unit,general});
export const configs: Config[] = problemCategories.flatMap(category => category.problemIds.map(id=>{
  const problem=problems.find(p=>p.id===id)!;
  const s=specs[id]; if(!s)throw new Error("Missing quantification config: "+id);
  const unit=s.unit??"Units";
  const available=new Set<Section>(s.sections??["Quantity","Time","Frequency","Comparison",...(s.money?["Money" as const]:[])]);
  available.add("Time");
  const fields:Record<Section,Field[]>={Quantity:[],Time:[],Frequency:[],Comparison:[],Money:[]};
  if(available.has("Quantity")) fields.Quantity=[field("total",s.total,unit,true),field("affected",s.affected,unit),field("unaffected",s.unaffected,unit),field("affectedPct",s.rate,"%"),field("unaffectedPct","Unaffected percentage","%")];
  fields.Time=[field("months","How long has this been happening for?","months",true)];
  const timePopulation=s.time==="recorded"?"recordedUnits":s.time?"affected":undefined;
  if(s.time==="recorded") fields.Time.push(field("recordedUnits","Units with recorded duration",unit,true),field("hours","Total recorded duration","hrs",true),field("averageMinutes","Average time per unit","min"));
  if(s.time==="affected") fields.Time.push(field("hours","Total time for affected quantity","hrs",true),field("averageMinutes","Average time per unit","min"));
  if(s.time==="staff") fields.Time.push(field("hours","Staff hours required","hrs",true),field("averageMinutes","Average time per unit","min"));
  if(available.has("Frequency")) fields.Frequency=[field("affected",s.affected,unit,true),field("days","Measurement period","Days"),field("daily","Affected quantity per day","/day")];
  const actualKey=available.has("Comparison")?(s.actualKey??"affected"):undefined;
  const compUnit=s.compareUnit??unit;
  if(actualKey) fields.Comparison=[field(actualKey,s.actual??s.affected,compUnit,true),field("target",s.target??"Target value",compUnit),field("difference","Difference",compUnit),field("targetPct","Percentage of target","%")];
  if(available.has("Money")&&s.money) fields.Money=[field("moneyTotal",s.money[0],"Currency",true),field("moneyAverage",s.money[1],"Currency/unit")];
  const example:Record<string,string>={total:"100",affected:"20",months:"3"};
  if(fields.Frequency.length)example.days="30";
  if(timePopulation){if(timePopulation==="recordedUnits")example.recordedUnits="10";example.averageMinutes="15";}
  if(actualKey)example.target=actualKey==="hours"?"8":actualKey==="averageMinutes"?"10":"10";
  if(fields.Money.length)example.moneyAverage="50";
  return {id,name:problem.name,category:category.title,fields,timePopulation,actualKey,moneyPopulation:fields.Money.length?"affected":undefined,example,reference:s.reference??"reconstructed"};
}));
