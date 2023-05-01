# Chess two ways
## A demonstration of React, React Native, and Domain Driven Design 
### (...and chess)
<br>
<br>
This `yarn` monorepo has three packages:

```  
"packages": [
  "just-the-chess",
  "apps/chess-web",
  "apps/chess-rn"
]
```

They are named and organized this way to further re-enforce the separation of concerns between the core domain (in `just-the-chess/`), and the two actual apps (in `chess-web` and in `chess-rn`)

## Domain Driven Design 
This is about valuing a self-contained domain that is agnostic toward how it's displayed or how and applications that use it are implementated.  The result can basically be unit tested via CLI if desired, because it's unpoluted by UI platform quirks and the slings and arrows of moving pixels.  Please enjoy the [longer discussion and links](./DDD.md).

## Core architecture
The core functionality of Chess is implemented in `just-the-chess/` and [extensively discussed here](./just-the-chess/CORE_ARCH.md). 

## React Web app
This React app runs using the most excellent [Vite](https://vitejs.dev/) dev server and bundler.  It lives in `apps/chess-web` and is [documented here](./apps/chess-web/README.md).

## React Native app (Android)
This React Native app runs using the Metro bundler and dev server.  It lives in `apps/chess-rn` and is [documented here](./apps/chess-rn/README.md).

## Repo scripts

(coming soon)

