export interface Goal {
  word: string;
  is_default?: boolean;
}

export interface ReviewState {
  [word: string]: any;
}

/**
 * Build active goals and goal ranking map based on current goals,
 * default word list, and review state.
 *
 * If the learner has any custom goals, those are treated as the active
 * goal list. Otherwise we fall back to the provided default words.
 *
 * The returned goalRanks object maps each goal word to its rank (1-based)
 * according to its order in the default list followed by active goals.
 */
export function buildGoalRanks(
  goals: Goal[],
  defaults: string[],
  _review: ReviewState,
): { activeGoals: Goal[]; goalRanks: Record<string, number> } {
  const customGoals = goals.filter((g) => !g.is_default);
  const activeGoals =
    customGoals.length > 0
      ? customGoals
      : defaults.map((w) => ({ word: w }));

  const goalRanks: Record<string, number> = {};
  defaults.forEach((w, i) => {
    goalRanks[w] = i + 1;
  });
  activeGoals.forEach((g, i) => {
    goalRanks[g.word] = i + 1;
  });

  return { activeGoals, goalRanks };
}
