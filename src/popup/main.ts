import { MESSAGE_TYPES } from "src/lib/helpers/messages.helper";
import "./styles/index.scss";

console.log("Hello Google Chrome");

(async () => {
  const res = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.TEST, data: {} });

  console.log("Service worker returns: ", res);
})();
