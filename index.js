import sapp, { argv } from "@randajan/simple-lib";
import { sassPlugin } from "./src/build/index.js";

sapp(argv.isBuild, {
    mode:"web",
    plugins:[sassPlugin()],
    lib:{
        entries:[
            "index.js",
            "build/index.js",
            "ui/index.js",
            "graphs/index.js",
            "stats/index.js",
            "game/index.js",
            "time/index.js",
            "locale/index.js",
            "styles/index.js"
        ]
    }
})
