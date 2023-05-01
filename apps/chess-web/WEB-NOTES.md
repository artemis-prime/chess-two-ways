# Platform notes for web
## To run (first time): 

`yarn build:first-time` 

`yarn serve:web`

## To see changes made to `packages/chess`, 

`build:domain` is tsc build (to just check types and compile errors)

`update-dep:web` refreshes the local dependencies of `web` to prepare the dev server

`prepare:serve` combines the above two

`yarn serve:web` compiles `web` as needed and runs the dev server

## To run (and see any changes made to `web`)

`yarn serve:web` Just let this run and let HMR reload your changes as needed


## To see stuff, visit [`localhost:8080`](http://localhost:8080/)

[return to main doc](../../README.md)