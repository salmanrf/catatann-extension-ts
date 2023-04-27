import { render } from "preact";
import { Main } from "src/popup/containers/Main";
import "./styles/popup.scss";

(async () => {
  render(Main, document.querySelector("body")!);
})();
