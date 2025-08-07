import reducer, { termsAndPolicies } from '../../../../src/redux/slices/termsAndPoliciesSlice';

termsAndPolicies;
describe('termsAndPoliciesSlice', () => {
  const initialState = {
    loading: false,
    data: null,
    error: null
  };

  it('should handle termsAndPolicies.pending', () => {
    const action = { type: termsAndPolicies.pending.type };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: true,
      data: null,
      error: null
    });
  });

  it('should handle termsAndPolicies.fulfilled', () => {
    const payload = { terms: 'some text' };
    const action = { type: termsAndPolicies.fulfilled.type, payload };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: false,
      data: payload,
      error: null
    });
  });

  it('should handle termsAndPolicies.rejected', () => {
    const action = { type: termsAndPolicies.rejected.type, payload: 'fetch error' };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      loading: false,
      data: null,
      error: 'fetch error'
    });
  });
});
