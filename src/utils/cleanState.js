export default function cleanStateModel(model) {
  const initialState = JSON.parse(JSON.stringify(model.state));
  const ret = {
    ...model,
    effects: {
      ...model.effects,
      * cleanState(_, { put }) {
        yield put({
          type: 'updateState',
          payload: initialState,
        });
      },
    },
  };
  return ret;
}
