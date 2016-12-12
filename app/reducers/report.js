const initialState = {
  answers: [],
  statistics: [],
  user: {}
};

export default function report(state = initialState , action) {
  switch (action.type) {
    case 'REPORT_ADD_ANSWERS':
      return Object.assign({}, state, {
        answers: action.items
      });
    case 'REPORT_ADD_STATISTICS':
      return Object.assign({}, state, {
        statistics: action.items
      });
    case 'REPORT_ADD_USER':
      return Object.assign({}, state, {
        user: action.item
      });
    case 'CLEAR_REPORT':
      return initialState;
    default:
      return state;
  }
}
