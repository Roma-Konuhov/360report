const initialState = {
  fileUploaded: '',
};

export default function uploader(state = initialState, action) {
  switch (action.type) {
    case 'CHECK_UPDATES_FOR_UPLOADED_FILE':
      return { fileUploaded: action.inputName };
    case 'UPLOAD_RESET':
      return initialState;
    default:
      return state;
  }
}