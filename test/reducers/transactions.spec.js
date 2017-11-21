import reducer from '../../app/reducers/transactions';
import type { Action } from '../../app/actions/action.d';

describe('transactions reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  describe('REQUEST_TRANSACTIONS action', () => {
    it('should initialize an empty state', () => {
      expect(
        reducer(undefined, {
          type: 'REQUEST_TRANSACTIONS',
          source: { id: 'testexchange' },
        }),
      ).toEqual({
        testexchange: {
          openRequests: 1,
          trades: [],
          transfers: [],
        },
      });
    });

    it('should keep existing transactions', () => {
      const state = {
        testexchange: {
          openRequests: 2,
          trades: [{ id: 'trade' }],
          transfers: [{ id: 'transfer' }],
        },
      };

      expect(
        reducer(state, {
          type: 'REQUEST_TRANSACTIONS',
          source: { id: 'testexchange' },
        }),
      ).toEqual({
        testexchange: {
          openRequests: 3,
          trades: [{ id: 'trade' }],
          transfers: [{ id: 'transfer' }],
        },
      });
    });
  });

  describe('RECEIVE_TRANSACTIONS action', () => {
    it('should reduce the number of open requests', () => {
      const state = {
        testexchange: {
          openRequests: 2,
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'RECEIVE_TRANSACTIONS',
        exchange: { id: 'testexchange' },
        trades: [],
        transfers: []
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 1,
          trades: [],
          transfers: [],
        },
      });
    });

    it('should add new transactions to initial state', () => {
      const state = {
        testexchange: {
          openRequests: 1,
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'RECEIVE_TRANSACTIONS',
        exchange: { id: 'testexchange' },
        trades: [{ id: 'trade 1' }],
        transfers: [{ id: 'transfer 1' }]
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 0,
          trades: [{ id: 'trade 1' }],
          transfers: [{ id: 'transfer 1' }]
        }
      });
    });

    it('should merge existing state with new transactions', () => {
      const state = {
        testexchange: {
          openRequests: 1,
          trades: [{ id: 'trade 1' }],
          transfers: [{ id: 'transfer 1' }],
        },
      };

      const action: Action = {
        type: 'RECEIVE_TRANSACTIONS',
        exchange: { id: 'testexchange' },
        trades: [{ id: 'trade 2' }],
        transfers: [{ id: 'transfer 2' }]
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 0,
          trades: [{ id: 'trade 1' }, { id: 'trade 2' }],
          transfers: [{ id: 'transfer 1' }, { id: 'transfer 2' }]
        }
      });
    });
  });

  describe('RECEIVE_TRADES action', () => {
    it('should add new trades to initial state', () => {
      const state = {
        testexchange: {
          openRequests: 1,
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'RECEIVE_TRADES',
        exchange: { id: 'testexchange' },
        trades: [{ id: 'trade 1' }]
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 0,
          trades: [{ id: 'trade 1' }],
          transfers: []
        }
      });
    });

    it('should merge existing state with new trades', () => {
      const state = {
        testexchange: {
          openRequests: 1,
          trades: [{ id: 'trade 1' }],
          transfers: [],
        },
      };

      const action: Action = {
        type: 'RECEIVE_TRADES',
        exchange: { id: 'testexchange' },
        trades: [{ id: 'trade 2' }]
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 0,
          trades: [{ id: 'trade 1' }, { id: 'trade 2' }],
          transfers: []
        }
      });
    });
  });

  describe('RECEIVE_TRANSFERS action', () => {
    it('should add new transfers to initial state', () => {
      const state = {
        testexchange: {
          openRequests: 1,
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'RECEIVE_TRANSFERS',
        exchange: { id: 'testexchange' },
        transfers: [{ id: 'transfer 1' }]
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 0,
          trades: [],
          transfers: [{ id: 'transfer 1' }]
        }
      });
    });

    it('should merge existing state with new transfers', () => {
      const state = {
        testexchange: {
          openRequests: 1,
          trades: [],
          transfers: [{ id: 'transfer 1' }],
        },
      };

      const action: Action = {
        type: 'RECEIVE_TRANSFERS',
        exchange: { id: 'testexchange' },
        transfers: [{ id: 'transfer 2' }]
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 0,
          trades: [],
          transfers: [{ id: 'transfer 1' }, { id: 'transfer 2' }]
        }
      });
    });
  });

  describe('FAILED_TRANSACTION_REQUEST action', () => {
    it('should add the error message to the state', () => {
      const state = {
        testexchange: {
          openRequests: 1,
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'FAILED_TRANSACTION_REQUEST',
        exchange: { id: 'testexchange' },
        error: 'Request failed'
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: 0,
          trades: [],
          transfers: [],
          error: 'Request failed'
        }
      });
    });
  });
});
