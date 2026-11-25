import type { Agent, ImpactKind, Problem } from "./data";

export type Mode = "personalized" | "all";
export type Selection = Record<ImpactKind, string[]>;
export type ProblemState = { confirmed: boolean; expanded: boolean; mode: Mode; selected: Selection };
export const initialState: ProblemState = { confirmed: false, expanded: false, mode: "personalized", selected: { operational: [], financial: [] } };

export type Action =
  | { type: "confirm" }
  | { type: "expand" }
  | { type: "mode"; mode: Mode }
  | { type: "impact"; kind: ImpactKind; id: string };

export function problemReducer(state: ProblemState, action: Action): ProblemState {
  switch (action.type) {
    case "confirm": return { ...state, confirmed: !state.confirmed };
    case "expand": return { ...state, expanded: !state.expanded };
    case "mode": return { ...state, mode: action.mode };
    case "impact": {
      const current = state.selected[action.kind];
      const next = current.includes(action.id) ? current.filter(id => id !== action.id) : [...current, action.id];
      return { ...state, selected: { ...state.selected, [action.kind]: next } };
    }
  }
}

export function visibleOutcomes(problem: Problem, agent: Agent, kind: ImpactKind, state: ProblemState) {
  const outcomes = kind === "operational" ? agent.operationalOutcomes : agent.financialOutcomes;
  // Only outcomes associated with this problem are applicable, even if the agent is shared.
  const links = problem.links.filter(link => link.kind === kind && link.agentId === agent.id);
  return outcomes.filter(outcome => links.some(link => link.outcomeId === outcome.id &&
    (state.mode === "all" || state.selected[kind].includes(link.impactId))));
}

export function relevantFunctions(problem: Problem, agent: Agent, state: ProblemState) {
  return new Set([...visibleOutcomes(problem, agent, "operational", state), ...visibleOutcomes(problem, agent, "financial", state)].flatMap(outcome => outcome.functionIds));
}
