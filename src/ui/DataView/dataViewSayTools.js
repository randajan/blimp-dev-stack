const fallbacks = Object.freeze({
    AllOption:"Vše",
    ClearFilterLabel:"Vymazat filtr",
    EmptyLabel:"Žádné výsledky",
    FilterLabel:"Filtr",
    GridViewLabel:"Mřížka",
    MaxPlaceholder:"Max",
    MinPlaceholder:"Min",
    NoOption:"Ne",
    NoOptionsLabel:"Žádné možnosti",
    ResetLabel:"Resetovat",
    SearchPlaceholder:"Hledat…",
    SortLabel:"Řazení",
    SortDateAscLabel:"Nejstarší",
    SortDateDescLabel:"Nejnovější",
    SortNumberAscLabel:"Nejnižší",
    SortNumberDescLabel:"Nejvyšší",
    SortTextAscLabel:"A–Z",
    SortTextDescLabel:"Z–A",
    TableViewLabel:"Tabulka",
    YesOption:"Ano"
});

export const sayDataView = (say, id)=>{
    const fallback = fallbacks[id];
    if (typeof say !== "function") { return fallback; }
    return typeof say.or === "function" ? say.or(`dataView${id}`, fallback) : say(`dataView${id}`);
};
