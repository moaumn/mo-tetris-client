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

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
