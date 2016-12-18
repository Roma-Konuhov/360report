
export function refreshAll() {
  return {
    type: 'APP_STATE_REFRESH_ALL_ENTITIES'
  };
}

export function refresh(item) {
  return {
    type: 'APP_STATE_REFRESH_ENTITY',
    item
  };
}

export function toggleRowSelection(id) {
  return {
    type: 'APP_STATE_PAGES_TOGGLE_SELECTION',
    id
  }
}

export function clearAppState() {
  return {
    type: 'APP_STATE_CLEAR'
  };
}


