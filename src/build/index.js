import { extraUnitsEsbuild } from "@randajan/postcss-extra-units/esbuild";
import { sassPlugin as createSassPlugin } from "esbuild-sass-plugin";

const _viewPortRatio = 3;


export const unitsPlugin = (units={})=>extraUnitsEsbuild({
    ...units,
    vhf: n => `calc(${n / _viewPortRatio}em + ${n}vh)`,
    vwf: n => `calc(${n / _viewPortRatio}em + ${n}vw)`
});


export const sassPlugin = (options = {})=>{
    const opt = {...options};
    const { units } = opt;

    delete opt.units;

    const up = unitsPlugin(units);

    return createSassPlugin({
        filter:/\.s[ac]ss$/,
        transform:css=>up.transform(css),
        ...options
    })
};
