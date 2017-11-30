import reducer from '../../app/reducers/transactions';
import type { Action } from '../../app/actions/action.d';

describe('transactions reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  describe('REQUEST_BALANCES action', () => {
    it('should initialize an empty state', () => {
      expect(reducer(undefined, {
        type: 'REQUEST_BALANCES',
        source: { id: 'testexchange' },
      })).toEqual({
        testexchange: {
          openRequests: {
            balances: 1,
            transactions: 0,
          },
          balances: {},
          trades: [],
          transfers: [],
        },
      });
    });
  });

  describe('REQUEST_TRANSACTIONS action', () => {
    it('should initialize an empty state', () => {
      expect(reducer(undefined, {
        type: 'REQUEST_TRANSACTIONS',
        source: { id: 'testexchange' },
      })).toEqual({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 1,
          },
          balances: {},
          trades: [],
          transfers: [],
        },
      });
    });

    it('should keep existing transactions', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 2,
          },
          trades: [{ id: 'trade' }],
          transfers: [{ id: 'transfer' }],
        },
      };

      expect(reducer(state, {
        type: 'REQUEST_TRANSACTIONS',
        source: { id: 'testexchange' },
      })).toEqual({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 3,
          },
          trades: [{ id: 'trade' }],
          transfers: [{ id: 'transfer' }],
        },
      });
    });
  });

  describe('RECEIVE_BALANCES action', () => {
    it('should reduce the number of open requests', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 2,
            transactions: 2,
          },
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'RECEIVE_BALANCES',
        exchange: { id: 'testexchange' },
        balances: {
          ETH: 5,
          BTC: 2,
        },
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: {
            balances: 1,
            transactions: 2,
          },
          balances: {
            ETH: 5,
            BTC: 2,
          },
        },
      });
    });

    it('should update balances', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 1,
            transactions: 1,
          },
          balances: {
            ETH: 2,
          },
        },
      };

      const action = {
        type: 'RECEIVE_BALANCES',
        exchange: { id: 'testexchange' },
        balances: {
          ETH: 5,
          BTC: 2,
        },
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 1,
          },
          balances: {
            ETH: 5,
            BTC: 2,
          },
        },
      });
    });
  });

  describe('RECEIVE_TRANSACTIONS action', () => {
    it('should reduce the number of open requests', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 2,
          },
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'RECEIVE_TRANSACTIONS',
        exchange: { id: 'testexchange' },
        trades: [],
        transfers: [],
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 1,
          },
          trades: [],
          transfers: [],
        },
      });
    });

    it('should add new transactions to initial state', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 1,
          },
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'RECEIVE_TRANSACTIONS',
        exchange: { id: 'testexchange' },
        trades: [{ id: 'trade 1' }],
        transfers: [{ id: 'transfer 1' }],
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 0,
          },
          trades: [{ id: 'trade 1' }],
          transfers: [{ id: 'transfer 1' }],
        },
      });
    });

    it('should merge existing state with new transactions', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 1,
          },
          trades: [{ id: 'trade 1' }],
          transfers: [{ id: 'transfer 1' }],
        },
      };

      const action: Action = {
        type: 'RECEIVE_TRANSACTIONS',
        exchange: { id: 'testexchange' },
        trades: [{ id: 'trade 2' }],
        transfers: [{ id: 'transfer 2' }],
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 0,
          },
          trades: [{ id: 'trade 1' }, { id: 'trade 2' }],
          transfers: [{ id: 'transfer 1' }, { id: 'transfer 2' }],
        },
      });
    });
  });

  describe('FAILED_BALANCES action', () => {
    it('should add the error message to the state', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 1,
            transactions: 1,
          },
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'FAILED_BALANCES',
        exchange: { id: 'testexchange' },
        error: 'Request failed',
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 1,
          },
          trades: [],
          transfers: [],
          error: 'Request failed',
        },
      });
    });
  });

  describe('FAILED_TRANSACTIONS action', () => {
    it('should add the error message to the state', () => {
      const state = {
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 1,
          },
          trades: [],
          transfers: [],
        },
      };

      const action = {
        type: 'FAILED_TRANSACTIONS',
        exchange: { id: 'testexchange' },
        error: 'Request failed',
      };

      expect(reducer(state, action)).toMatchObject({
        testexchange: {
          openRequests: {
            balances: 0,
            transactions: 0,
          },
          trades: [],
          transfers: [],
          error: 'Request failed',
        },
      });
    });
  });
});
