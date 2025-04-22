import reducer, { errorTranslation } from '../../../../src/redux/slices/errorTranslationSlice';

errorTranslation;
describe('errorTranslationSlice', () => {
  const initialState = {
    loading: false,
    data: null,
    error: null
  };

  it('should handle errorTranslation.pending', () => {
    const action = { type: errorTranslation.pending.type };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: true,
      data: null,
      error: null
    });
  });

  it('should handle errorTranslation.fulfilled', () => {
    const payload = { msg: 'translated' };
    const action = { type: errorTranslation.fulfilled.type, payload };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: false,
      data: payload,
      error: null
    });
  });

  it('should handle errorTranslation.rejected', () => {
    const action = { type: errorTranslation.rejected.type, payload: 'error occurred' };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: false,
      data: null,
      error: 'error occurred'
    });
  });
});
