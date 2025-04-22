import reducer, { complete } from '../../../../src/redux/slices/completeSlice';

describe('completeSlice', () => {
  const initialState = {
    loading: false,
    data: null,
    error: null
  };

  it('should handle complete.pending', () => {
    const action = { type: complete.pending.type };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: true,
      data: null,
      error: null
    });
  });

  it('should handle complete.fulfilled', () => {
    const payload = { message: 'success' };
    const action = { type: complete.fulfilled.type, payload };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: false,
      data: payload,
      error: null
    });
  });

  it('should handle complete.rejected', () => {
    const action = { type: complete.rejected.type, payload: 'some error' };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: false,
      data: null,
      error: 'some error'
    });
  });
});
