"use client";

import { useReducer, useState, type ReactNode } from "react";
import { agents, problems, problemCategories, type Agent, type AgentIcon, type ImpactKind, type Outcome, type Problem } from "./data";
import { initialState, matchedSolutions, problemReducer, relevantFunctions, visibleOutcomes, visibleOutcomeExplanations, type Mode, type ProblemState } from "./model";
import { functionLibrary } from "./functions";
import "./discovery.css";

function Chevron({ open = false }: { open?: boolean }) {
  return <svg className={`chevron ${open ? "is-open" : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Check({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Icon({ icon }: { icon: AgentIcon }) {
  return <span className="agent-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {icon === "inbound" ? <><path d="M20 16v3a2 2 0 0 1-2.2 2A18 18 0 0 1 3 6.2 2 2 0 0 1 5 4h3l2 5-2 2a14 14 0 0 0 5 5l2-2z"/><path d="M14 3v6h6M20 3l-6 6"/></> :
     icon === "speed" ? <path d="m13 2-9 12h7l-1 8 10-12h-8z"/> :
     icon === "revival" ? <><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/><path d="M12 7v5l3 2"/></> :
     icon === "guardian" ? <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18m-12 5 2 2 4-4"/></> :
     <><rect x="4" y="6" width="16" height="14" rx="3"/><path d="M12 3v3M8 12h.01M16 12h.01M9 16h6"/></>}
  </svg></span>;
}
function CircleInput({ checked, onChange, label, className = "" }: { checked: boolean; onChange: () => void; label: string; className?: string }) {
  return <label className={`circle-label ${className}`}><input type="checkbox" className="circle-input" checked={checked} onChange={onChange}/><span>{label}</span></label>;
}
function Description({ title, children, tone }: { title: string; children: ReactNode; tone?: ImpactKind }) {
  // Native independent disclosure state is preserved because the parent never unmounts.
  return <details className="description"><summary>{tone ? <span className={`outcome-tone-${tone}`}>{title}</span> : title}<Chevron/></summary><div className="description-content">{children}</div></details>;
}
function Empty({ children }: { children: ReactNode }) { return <p className="empty-note">{children}</p>; }
function OutcomeColumn({ title, outcomes, empty, tone }: { title: string; outcomes: Outcome[]; empty: string; tone: ImpactKind }) {
  return <div><h4 className="outcome-heading"><span className={`outcome-tone-${tone}`}>{title}</span></h4>{outcomes.length ? <ul className="outcome-list">{outcomes.map(outcome => <li key={outcome.id}><Check className="green-check"/><span>{outcome.title}</span></li>)}</ul> : <Empty>{empty}</Empty>}</div>;
}
function Explanations({ outcomes, empty, mode }: { outcomes: Outcome[]; empty: string; mode: Mode }) {
  return outcomes.length ? <div className="explanations">{outcomes.map(outcome => <div className={mode === "personalized" ? "explanation personalized-explanation" : "explanation"} key={outcome.id}><h5>{outcome.title}</h5><p>{outcome.description}</p></div>)}</div> : mode === "all" ? <Empty>{empty}</Empty> : null;
}
const pendingAgent: Agent = { id: "pending", name: "Agent not yet provided", kind: "voice-agent", icon: "generic", overview: "Solution information has not been provided yet.", temporary: false, functionIds: [], operationalOutcomes: [], financialOutcomes: [] };
function SolutionCard({ problem, agent, state: problemState, pending = false }: { problem: Problem; agent: Agent; state: ProblemState; pending?: boolean }) {
  const [mode, setMode] = useState<Mode>("personalized");
  const state = { ...problemState, mode };
  const operational = visibleOutcomes(problem, agent, "operational", state);
  const financial = visibleOutcomes(problem, agent, "financial", state);
  const relevant = relevantFunctions(problem, agent, state);
  const functions = agent.functionIds.map(id => functionLibrary[id]).filter(fn => fn && fn.availability !== "proposed" && (mode === "all" || relevant.has(fn.id)));
  const message = (kind: ImpactKind) => pending ? "Content not yet provided." : state.mode === "personalized" ? `No related ${kind} impact has been confirmed.` : `No applicable ${kind} outcomes have been provided.`;
  return <div className="solution-entry" data-solution={agent.id}>
    <div className="mode-control" role="group" aria-label="Benefit viewing mode">
      <button type="button" aria-pressed={mode === "personalized"} onClick={() => setMode("personalized")}>Personalized</button>
      <button type="button" aria-pressed={mode === "all"} onClick={() => setMode("all")}>All benefits</button>
    </div>
    <div className="solution-card">
    <div className="agent-header"><Icon icon={agent.icon}/><div><h3>{agent.name}</h3>{agent.overview && <p>{agent.overview}</p>}</div></div>
    <hr/>
    <div className="two-columns">
      <OutcomeColumn tone="operational" title="Operational outcomes" outcomes={operational} empty={message("operational")}/>
      <OutcomeColumn tone="financial" title="Financial outcomes" outcomes={financial} empty={message("financial")}/>
    </div>
    <hr/>
    <div className="description-list">
      <Description title="How the agent functions">
        {functions.length ? <ul className="function-list">{functions.map(fn => <li key={fn.id} className={mode === "personalized" ? "personalized-function" : "relevant-function"}><span>{fn.name}</span><div>{fn.description}</div></li>)}</ul> : mode === "all" ? <Empty>Content not yet provided.</Empty> : null}
      </Description>
      <Description tone="operational" title="How it produces operational outcomes"><Explanations outcomes={visibleOutcomeExplanations(problem, agent, "operational", state)} empty={message("operational")} mode={mode}/></Description>
      <Description tone="financial" title="How it produces financial outcomes"><Explanations outcomes={visibleOutcomeExplanations(problem, agent, "financial", state)} empty={message("financial")} mode={mode}/></Description>
    </div>
    </div>
  </div>;
}
export function ProblemCard({ problem }: { problem: Problem }) {
  const [state, dispatch] = useReducer(problemReducer, initialState);
  const matching = matchedSolutions(problem, agents);
  return <section className="problem-card" data-problem={problem.id}>
    <div className="problem-header">
      <CircleInput className="problem-confirm" checked={state.confirmed} onChange={() => dispatch({type:"confirm"})} label={problem.name}/>
      <button type="button" className="problem-toggle" aria-expanded={state.expanded} aria-controls={`${problem.id}-content`} aria-label={`${state.expanded ? "Collapse" : "Expand"} ${problem.name}`} onClick={() => dispatch({type:"expand"})}><Chevron open={state.expanded}/></button>
    </div>
    <div className="problem-content" id={`${problem.id}-content`} hidden={!state.expanded}>
      <hr className="discovery-divider"/>
      <div className="two-columns impact-columns">
        {(["operational","financial"] as const).map(kind => {
          const impacts = kind === "operational" ? problem.operationalImpacts : problem.financialImpacts;
          return <div key={kind}><h4 className="impact-heading"><span className={`impact-tone-${kind}`}>Confirmed {kind} impacts</span></h4>
            {impacts.length ? <div className="impact-list">{impacts.map(impact => <CircleInput key={impact.id} checked={state.selected[kind].includes(impact.id)} onChange={() => dispatch({type:"impact",kind,id:impact.id})} label={impact.label}/>)}</div> : null}
          </div>;
        })}
      </div>
      <hr/>
      <h2 className="matched-heading">Solution</h2>
      {matching.length ? matching.map(agent => <SolutionCard key={agent.id} agent={agent} problem={problem} state={state}/>) : <SolutionCard agent={pendingAgent} problem={problem} state={state} pending/>}
    </div>
  </section>;
}
const problemsById: Record<string, Problem> = Object.fromEntries(problems.map(problem => [problem.id, problem]));

export default function Discovery() {
  return <main className="discovery-page"><section className="discovery-shell" aria-labelledby="discovery-heading"><h1 id="discovery-heading">Discovery</h1><div className="problem-list">{problemCategories.map(category => <section className="problem-category" key={category.title}><h2 className="problem-category-title">{category.title}</h2><div className="problem-list">{category.problemIds.map(id => <ProblemCard key={id} problem={problemsById[id]}/>)}</div></section>)}</div></section></main>;
}
