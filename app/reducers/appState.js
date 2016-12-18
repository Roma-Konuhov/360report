import _ from 'lodash';

const initialState = {
  refresh: '',            //  possible values: all | people_relation | consultant_report | manager_report
  pages: {
    lms: {
      selectedIds: []
    }
  }
};

export default function appState(state = initialState, action) {
  switch (action.type) {
    case 'APP_STATE_REFRESH_ENTITY':
      return Object.assign({}, state, { refresh: action.item });
    case 'APP_STATE_REFRESH_ALL_ENTITIES':
      return Object.assign({}, state, { refresh: 'all' });
    case 'APP_STATE_PAGES_TOGGLE_SELECTION':
      const selectedIds = state.pages.lms.selectedIds;
      return Object.assign({}, state, {
        pages: { lms: { selectedIds: selectedIds.indexOf(action.id) === -1 ?
          [...selectedIds, action.id] :
          _.filter(selectedIds, (id) => id !== action.id)
        }}
      });
    case 'APP_STATE_CLEAR':
      return initialState;
    default:
      return state;
  }
}