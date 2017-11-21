import reducer from '../../app/reducers/transactions';

describe('transactions reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  describe('should handle REQUEST_TRANSACTIONS', () => {
    it('and initialize an empty state', () => {
      expect(
        reducer(undefined, {
          type: 'REQUEST_TRANSACTIONS',
          source: { id: 'id' },
        }),
      ).toEqual({
        id: {
          openRequests: 1,
          trades: [],
          transfers: [],
        },
      });
    });

    it('and keep existing transactions', () => {
      const state = {
        id: {
          openRequests: 2,
          trades: [{ id: 'trade' }],
          transfers: [{ id: 'transfer' }],
        },
      };
      expect(
        reducer(state, {
          type: 'REQUEST_TRANSACTIONS',
          source: { id: 'id' },
        }),
      ).toEqual({
        id: {
          openRequests: 3,
          trades: [{ id: 'trade' }],
          transfers: [{ id: 'transfer' }],
        },
      });
    });
  });
});
