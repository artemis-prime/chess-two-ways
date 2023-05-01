# Chess two ways
## A demonstration of React, React Native, and Domain Driven Design (...and chess)

This is a `yarn` monorepo with three packages...
```  
"packages": [
  "just-the-chess",
  "apps/chess-web",
  "apps/chess-rn"
]
```

They are named and organized this way to further re-enforce the separation of concerns between the core domain (in `just-the-chess/`), and the two actual apps (in `chess-web` and in `chess-rn`)

## Domain Driven Design 
Is about having self contained domain code that is agnostic toward display and app implementation, that could basically be unit tested via CLI, and is therefore unpoluted by UI Library quirks and sligns and arrows.  Please find the [longer discussion and links](./DDD.md).

## Core architecture
The core functionality of Chess is implemented in `just-the-chess/` and [extensively discussed here](./just-the-chess/CORE_ARCH.md). 

## React Web app
This React app runs using the most excellent [Vite](https://vitejs.dev/) dev server and bundler.  It lives in `apps/chess-web` and is [documented here](./apps/chess-web/README.md).

## React Native app (Android)
This React Native app runs using the Metro bundler and dev server.  It lives in `apps/chess-rn` and is [documented here](./apps/chess-rn/README.md).

## Repo scripts

(coming soon)

