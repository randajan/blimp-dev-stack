import sapp, { argv } from "@randajan/simple-lib";
import { sassPlugin } from "esbuild-sass-plugin";


const toStyleModule = css=>{
    const source = JSON.stringify(css);
    return `
        if (typeof document !== "undefined") {
            const style = document.createElement("style");
            style.textContent = ${source};
            document.head.appendChild(style);
        }
        export default ${source};
    `;
};

sapp(argv.isBuild, {
    mode:"web",
    plugins:[sassPlugin({ type:toStyleModule })],
    lib:{
        entries:[
            "index.js",
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
