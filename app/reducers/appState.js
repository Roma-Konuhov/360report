const initialState = {
  refresh: '',            //  possible values: all | people_relation | consultant_report | manager_report
};

export default function appState(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH_ENTITY':
      return { refresh: action.item };
    case 'REFRESH_ALL_ENTITIES':
      return { refresh: 'all' };
    case 'RESET_STATE_TO_INIT':
      return initialState;
    default:
      return state;
  }
}