import App from "./app";

import FlowRoute from "./routes/flow.routes";

const app = new App([new FlowRoute()]);

app.listen();
