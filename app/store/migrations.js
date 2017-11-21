export const migrations = {
  0: (state) => ({
    ...state
  }),
  1: (state) => ({
    ...state,
    transactions: undefined,
  }),
};
