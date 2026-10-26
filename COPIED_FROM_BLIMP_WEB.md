# Copied from blimp-web

Initial source snapshot copied from `blimp-web` into `blimp-dev-stack`:

- `src/frontend/elements`: `Clocks`, `DataView`, `Graphs`, `Img`, `ImgStore`, `TextCounter`, `Wizard`
- `src/frontend/frames/Profile`: `CharacterCard`, `StatsPanel`
- `src/frontend/pages/Community`
- `src/frontend/assets/Locale.js`
- `src/frontend/styles` and `src/frontend/frames/App/App.scss`
- `src/arc/game`: `_consts.js`, `collectStats.js`, `grades.js`, `showStats.js`
- `src/arc/locale`: `consts.js`, `defaultTranslations.json`, `tools.js`
- `src/arc/tools`: `date.js`, `dateStrings.js`, `msToClock.js`

The files were copied, not moved. Their originals remain in `blimp-web`.

## Current layout in blimp-dev-stack

- `src/ui`: DataView, Clocks, Img, ImgStore, TextCounter and Wizard
- `src/graphs`: reusable chart components
- `src/stats`: StatsPanel, CharacterCard and reusable CommunityStats
- `src/game`: collection, formatting and grading of game statistics
- `src/time`: shared date and duration helpers
- `src/locale`: Blimp locale, translations and the `Say` extension
- `src/styles`: global Blimp styles, variables, functions and the common SCSS entry

Component SCSS remains beside its component and is imported by that component.
The Sass build injects it into the corresponding JavaScript module; the shared
`styles` entry contains only the global Blimp layer.

Application-only connections were not retained. In particular, `CommunityStats`
receives users and profile-link rendering from its consumer, while `ImgStore`
receives its image source through `ImgStoreProvider`.
