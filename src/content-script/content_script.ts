import { render } from "preact";
import { ContentPopupContainer } from "src/content-script/containers/ContentPopupContainer";

(() => {
  setTimeout(() => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "0";
    container.style.height = "0";

    document.body.appendChild(container);

    render(ContentPopupContainer, container);
  }, 500);
})();
