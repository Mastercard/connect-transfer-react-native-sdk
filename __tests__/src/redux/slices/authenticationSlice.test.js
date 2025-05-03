import reducer, {
  setUrl,
  setModalVisible,
  setUrlData,
  resetData,
  authenticateUser
} from '../../../../src/redux/slices/authenticationSlice';

const initialState = {
  modalVisible: false,
  url: '',
  baseURL: '',
  queryParams: '',
  queryParamsObject: {},
  language: 'en',
  loading: false,
  data: null,
  error: null
};

describe('authenticationSlice', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle setUrl', () => {
    const url = 'https://example.com';
    const state = reducer(initialState, setUrl(url));
    expect(state.url).toBe(url);
  });

  it('should handle setUrl with empty string', () => {
    const state = reducer(initialState, setUrl(''));
    expect(state.url).toBe('');
    expect(state.modalVisible).toBe(false);
  });

  it('should handle setModalVisible', () => {
    const state = reducer(initialState, setModalVisible());
    expect(state.modalVisible).toBe(true);
  });

  it('should default to EN if queryParamsObject.language is undefined', () => {
    const payload = {
      baseURL: 'https://api.com',
      queryParams: 'foo=bar',
      queryParamsObject: { foo: 'bar' }
    };
    const state = reducer(initialState, setUrlData(payload));
    expect(state.language).toBe('en');
  });

  it('should default to EN if queryParamsObject.language is given', () => {
    const payload = {
      baseURL: 'https://api.com',
      queryParams: 'foo=bar',
      queryParamsObject: { foo: 'bar', language: 'es' }
    };
    const state = reducer(initialState, setUrlData(payload));
    expect(state.language).toBe('es');
  });

  it('should handle setUrlData with no queryParamsObject', () => {
    const payload = {
      baseURL: 'https://api.com',
      queryParams: 'foo=bar',
      queryParamsObject: undefined
    };
    const state = reducer(initialState, setUrlData(payload));
    expect(state.language).toBe('en');
  });

  it('should handle resetData', () => {
    const modifiedState = { ...initialState, url: 'something', modalVisible: true };
    const state = reducer(modifiedState, resetData());
    expect(state).toEqual(initialState);
  });

  it('should handle authenticateUser.pending', () => {
    const state = reducer(initialState, { type: authenticateUser.pending.toString() });
    expect(state.loading).toBe(true);
    expect(state.data).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should handle authenticateUser.fulfilled', () => {
    const action = { type: authenticateUser.fulfilled.type, payload: 'authData' };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.data).toBe('authData');
    expect(state.error).toBeNull();
  });

  it('should handle authenticateUser.rejected', () => {
    const action = { type: authenticateUser.rejected.type, payload: 'authError' };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.data).toBeNull();
    expect(state.error).toBe('authError');
  });
});
