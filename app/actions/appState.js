
export function refreshAll() {
  return {
    type: 'REFRESH_ALL_ENTITIES'
  };
}

export function refresh(item) {
  return {
    type: 'REFRESH_ENTITY',
    item
  };
}

export function refreshToInit() {
  return {
    type: 'RESET_STATE_TO_INIT'
  };
}


