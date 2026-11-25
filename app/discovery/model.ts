import type { Agent, ImpactKind, Problem } from "./data";

// One entry per solution ID, preserving relationship order and supporting any array length.
export function matchedSolutions(problem: Problem, library: Record<string, Agent>): Agent[] {
  return [...new Set(problem.solutions.map(item => item.solutionId))].map(id => library[id]).filter(Boolean);
}

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
  // Existing sample benefits can still be viewed in All benefits, but must never be
  // personalized from newly approved impacts until an explicit approved link exists.
  const preview = state.mode === "all" ? (problem.previewOutcomes ?? []).filter(item => item.kind === kind && item.agentId === agent.id) : [];
  return outcomes.filter(outcome => links.some(link => link.outcomeId === outcome.id &&
    (state.mode === "all" || state.selected[kind].includes(link.impactId))) ||
    preview.some(item => item.outcomeId === outcome.id));
}

export function relevantFunctions(problem: Problem, agent: Agent, state: ProblemState) {
  const explicit = problem.solutions.find(item => item.solutionId === agent.id)?.functionIds ?? [];
  const linked = state.mode === "personalized"
    ? [...visibleOutcomes(problem, agent, "operational", state), ...visibleOutcomes(problem, agent, "financial", state)].flatMap(outcome => outcome.functionIds)
    : [];
  return new Set([...explicit, ...linked]);
}
