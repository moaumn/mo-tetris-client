export function information(msg: string) {
  const div = document.createElement("div");
  div.className = "information";
  div.append(document.createTextNode(msg));
  div.addEventListener("transitionend", () => {
    if (div.style.opacity === "0") {
      div.remove();
    }
  });
  document.body.append(div);
  setTimeout(() => {
    div.style.top = "30px";
    div.style.opacity = "1";
  });
  setTimeout(() => {
    div.style.top = "-100px";
    div.style.opacity = "0";
  }, 5000);
}
