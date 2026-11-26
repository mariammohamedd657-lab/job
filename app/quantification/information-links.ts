import type { Config } from "./config";

// Relationships between distinct populations within ONE problem and its
// measurement scope. No new fields, numerical inputs or cross-problem aliases.
export type PopulationLink={
 population:string;
 member:string;
 // A subset has at most as many members as its population. An attributable
 // effect has no assumed conversion factor, only the zero-cause implication.
 kind:"subset"|"attributed";
 label:string;
};
export function operationalPopulationLinks(problemId:string,method:string,primary:string):PopulationLink[]{
 const subset=(member:string):PopulationLink=>({population:"affected",member,kind:"subset",label:member+" is a subset of the affected population"});
 const attributable=(member:string):PopulationLink=>({population:"affected",member,kind:"attributed",label:member+" is attributable to the affected population"});
 const links:PopulationLink[]=[];
 // These populations count unique individuals within the same affected events,
 // not the number of events themselves. No one-to-one conversion is assumed.
 if(method==="calls")links.push(subset("op:lost-leads:unique-leads"));
 if(method==="qualified")links.push(subset("op:lost-qualified-leads:affected-qualified-leads"));
 // Incomplete tasks attributable to overload are a subset of affected tasks,
 // not a synonym for all affected tasks.
 if(method==="tasks"&&problemId==="problem-28")links.push(subset(primary));
 // Bookings and invoices may have a many-to-many relationship with calls and
 // reminders; only the absence of any affected event excludes the attributed
 // population. Do not impose an unsupported one-to-one count limit.
 if(method==="booking")links.push(attributable("op:fewer-appointments-booked:intended-bookings"));
 if(method==="invoices"&&problemId==="problem-22")links.push(attributable("op:more-unpaid-invoices:affected-invoices"));
 // The selected impact quantifies the effect of THIS problem, not the entire
 // business's outcome. Zero affected events means zero attributable impact.
 // A positive effect requires a nonempty cause population, but does not
 // determine its exact count. No assumption about overlap of other impacts.
 if(primary!=="affected"&&!links.some(link=>link.member===primary))links.push(attributable(primary));
 return links;
}

// Recorded-duration units are observations within the same problem population.
 // They need not be affected units: the recorded sample can include timely responses.
export function basePopulationLinks(config:Config):PopulationLink[]{
 return config.timePopulation==="recordedUnits"?[{population:"total",member:"recordedUnits",kind:"subset",label:"Units with recorded duration are a subset of the total quantity"}]:[];
}
