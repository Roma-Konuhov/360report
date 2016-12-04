const initialState = {
  answers: [],
  statistics: []
};

export default function entities(state = initialState , action) {
  switch (action.type) {
    case 'ADD_ANSWERS':
      return Object.assign({}, state, {
        answers: action.items
      });
    case 'ADD_STATISTICS':
      return Object.assign({}, state, {
        statistics: action.items
      });
    default:
      return state;
  }
}
