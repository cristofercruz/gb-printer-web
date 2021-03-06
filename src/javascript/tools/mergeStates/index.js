const mergeStates = (currentState, updatedState, mergeImagesFrames) => {

  let frames = currentState.frames;
  let images = currentState.images;
  let palettes = currentState.palettes;

  if (mergeImagesFrames) {
    if (updatedState.frames && updatedState.frames.length) {
      frames.unshift(...updatedState.frames);
    }

    if (updatedState.images && updatedState.images.length) {
      images.unshift(...updatedState.images);
    }

    if (updatedState.palettes && updatedState.palettes.length) {
      palettes.unshift(...updatedState.palettes);
    }
  } else {
    frames = updatedState.frames || currentState.frames;
    images = updatedState.images || currentState.images;
    palettes = updatedState.palettes || currentState.palettes;
  }

  return {
    ...currentState,
    ...updatedState,
    images,
    frames,
    palettes,
  };
};

export default mergeStates;
