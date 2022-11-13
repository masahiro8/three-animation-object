export const ScrollCallback = (callback) => {
  window.addEventListener("scroll", () => {
    callback(window.pageYOffset);
  });
};
