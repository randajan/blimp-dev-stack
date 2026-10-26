# @randajan/blimp-dev-stack

Sdílené React komponenty, grafy, globální SCSS styly a herní utility pro projekty ekosystému Blimp.

Balíček je záměrně rozdělený do malých veřejných vstupů, aby si každý projekt načetl jen oblast, kterou používá.

## Veřejné vstupy

```js
import { DataView, ImgStoreProvider } from "@randajan/blimp-dev-stack/ui";
import { BlimpRating, PieChart } from "@randajan/blimp-dev-stack/graphs";
import { StatsPanel, CharacterCard, CommunityStats } from "@randajan/blimp-dev-stack/stats";
import { collectGameStats, getStatField } from "@randajan/blimp-dev-stack/game";
import { Clock, Timer } from "@randajan/blimp-dev-stack/ui";
import { msHour, formatMs } from "@randajan/blimp-dev-stack/time";
import { Locale, Say } from "@randajan/blimp-dev-stack/locale";
```

Stejné exporty jsou dostupné také ze základního vstupu:

```js
import { DataView, StatsPanel, collectGameStats } from "@randajan/blimp-dev-stack";
```

## Styly

Styly komponent jsou součástí jejich JavaScriptového buildu a načtou se spolu s komponentou. Globální Blimp vzhled, proměnné a základní pravidla se zapnou jedním samostatným importem:

```js
import "@randajan/blimp-dev-stack/styles";
```

Samotné SCSS funkce a mixiny:

```scss
@use "@randajan/blimp-dev-stack/styles/fn" as *;
```

## ImgStore

`ImgStore` už není napojený na konkrétní Bifrost beam. Zdroj obrázků se nastavuje providerem v hostitelské aplikaci:

```jsx
<ImgStoreProvider baseUrl="/images" images={imageManifest}>
    <App />
</ImgStoreProvider>
```

Pro nestandardní úložiště lze místo `baseUrl` předat funkci `resolveUrl`.

## CommunityStats

Komponenta dostává data přímo přes `users`. Směrování do profilu zůstává na hostitelské aplikaci přes `renderProfileLink`:

```jsx
<CommunityStats
    users={users}
    renderProfileLink={(profile, card)=><Link to={`/whois/${profile.aliasKey}`}>{card}</Link>}
/>
```

## Vývoj

```sh
npm run build
```

Projekt vyžaduje Node.js 16.9 nebo novější. Balíček je určený výhradně pro projekty Blimp a publikuje se veřejně pod MIT licencí.
