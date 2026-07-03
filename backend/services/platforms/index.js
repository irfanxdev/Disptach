import facebook from "./facebook.js";
import instagram from "./instagram.js";
import x from "./x.js";
import linkedin from "./linkedin.js";
import pinterest from "./pinterest.js";

// Central registry — adding a new platform later means adding one file
// and one line here, nothing else in the app has to change.
const adapters = { facebook, instagram, x, linkedin, pinterest };

export default adapters;
