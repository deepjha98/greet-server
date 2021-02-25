const initState = {
  webCamEnabled: false,
  background: true,
};

const webBlur = (state = initialState, action) => {
  switch (action.type) {
    case "REMOVE_VIDEO_BACKGROUND":
      return { ...state, background: false };

    default:
      return { ...state };
  }
};
