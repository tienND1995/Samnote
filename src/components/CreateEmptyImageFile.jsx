const createEmptyImageFile = () => {
  const emptyBlob = new Blob([], { type: "image/png" });
  const emptyImageFile = new File([emptyBlob], "empty.png", {
    type: "image/png",
  });

  return emptyImageFile;
};

export default createEmptyImageFile;
