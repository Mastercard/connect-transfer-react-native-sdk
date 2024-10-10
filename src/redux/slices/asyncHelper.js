/**
 * Utility function for handling common async action states in Redux slices.
 * Manages loading, data, and error states for the provided async action.
 *
 * @param {Object} builder - The builder object for defining extra reducers.
 * @param {Function} action - The async action (thunk) to handle.
 */
export const handleAsyncActions = (builder, action) => {
  builder
    .addCase(action.pending, state => {
      state.loading = true;
      state.data = null;
      state.error = null;
    })
    .addCase(action.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.error = null;
    })
    .addCase(action.rejected, (state, { payload }) => {
      console.error('An error occurred:', payload);
      state.loading = false;
      state.data = null;
      state.error = payload;
    });
};
