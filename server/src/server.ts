import App from "./app";
import AuthRoute from "./routes/auth.routes";
import BusinessFlowRoute from "./routes/billingUnitFlow.routes";
import FlowRoute from "./routes/flow.routes";
const routes = [
    new FlowRoute(),
    new AuthRoute(),
    new BusinessFlowRoute(),
]

const app = new App(routes);

app.listen();
