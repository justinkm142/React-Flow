import App from "./app";
import AuthRoute from "./routes/auth.routes";
import BillingFlowRoute from "./routes/billingUnitFlow.routes";
import FlowRoute from "./routes/flow.routes";
import MonitoringFlowRoute from "./routes/monitoringUnitFlow.routes";
const routes = [
    new FlowRoute(),
    new AuthRoute(),
    new BillingFlowRoute(),
    new MonitoringFlowRoute(),
]

const app = new App(routes);

app.listen();
