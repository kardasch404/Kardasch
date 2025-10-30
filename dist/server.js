import app from './app.js';
import config from './config/config.js';
app.listen(config.port, () => {
    console.log(`server run on ${config.port}`);
});
//# sourceMappingURL=server.js.map