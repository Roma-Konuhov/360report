const initialState = {
  revieweesByConsultants: [],
  revieweesByManagers: [],
  peopleRelations: [],
  users: []
};

export default function entities(state = initialState , action) {
  switch (action.type) {
    case 'ADD_REVIEWEES_BY_CONSULTANTS':
      return Object.assign({}, state, {
        revieweesByConsultants: action.items
      });
    case 'ADD_REVIEWEES_BY_MANAGERS':
      return Object.assign({}, state, {
        revieweesByManagers: action.items
      });
    case 'ADD_PEOPLE_RELATIONS':
      return Object.assign({}, state, {
        peopleRelations: action.items
      });
    case 'ADD_USERS':
      return Object.assign({}, state, {
        users: action.items
      });
    default:
      return state;
  }
}
