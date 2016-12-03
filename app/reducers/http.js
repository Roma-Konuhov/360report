const initialState = {
  requestCounter: 0,
};

export default function http(state = initialState, action) {
  switch (action.type) {
    case 'SEND_REQUEST':
      return Object.assign({}, state.requestCounter, {
        requestCounter: state.requestCounter + 1
      });
    case 'RECEIVE_REQUEST':
      return Object.assign({}, state.requestCounter, {
        requestCounter: Math.max(0, state.requestCounter - 1)
      });
    default:
      return state;
  }
}