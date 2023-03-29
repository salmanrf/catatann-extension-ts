import { render } from "preact";
import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import { Main } from "src/popup/containers/Main";
import "./styles/index.scss";

(async () => {
  render(Main, document.querySelector("body"));

  const res = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.TEST, data: {} });

  console.log("service worker says", res);
})();
