<!--- This file is automatically generated. Dont edit! -->

# @SAEON/ATLAS

Monorepo format - this is the source code for SAEON's Atlas-related source code.

- [@saeon/ol-react](https://github.com/SAEONData/saeon-atlas/tree/master/src/%40saeon/ol-react)
- [@saeon/atlas-client](https://github.com/SAEONData/saeon-atlas/tree/master/src/%40saeon/atlas-client)
- [@saeon/atlas-api](https://github.com/SAEONData/saeon-atlas/tree/master/src/%40saeon/atlas-api)

## Setting up the REPO

- There are a number of `.sh` scripts that need to be made executable. Run this command: `chmod 771 **/*.sh`

# @saeon/ol-react

Install the package via the [NPM registry](https://npmjs.com/package/@saeon/atlas)

```sh
npm install @saeon/ol-react
```

## Modules

The basis of the Atlas is that it comprises of many `Modules`. Please see `./dev/index.jsx` (in this repository) for a working proof of concept that uses all the 'built-in' modules. This documentation describes how the example works, and is aimed at showing how to structure your own modules. These examples show two different mechanisms for 'composition' when authoring modules.

### Built in modules

#### SingleFeatureSelector

TODO

#### LayerManager

The OpenLayers library maintains it's own layer state. This is problematic when using React.js, since React will not update state automatically in response to changes to an OpenLayers `map` instance. This modules provides an array of 'proxy' layer objects, and helper functions to update these objects; these proxy layer objects are stored in React state. Essentially this module 'binds' react state to OpenLayers state, and makes working with layers easier.

TODO example

### Example 1

```jsx
class App extends PureComponent {
  constructor(props) { ... }

  render() {
    return (
      <Map>
        {({ map }) => (
          <div>
            {/* Add your modules here */}
            <Module1 map={map} />
            <Module2 map={map}/>
            <Module3 map={map}/>
          </div>
        )}
      </Map>
    )
  }
}
```

### Example 2

Since you can define your own modules, you can define composition. Nested module composition might be useful if, for example, Module1 contained filtering logic that you want to make available to other modules.

```jsx
class App extends PureComponent {
  constructor(props) { ... }

  render() {
    return (
      <Map>
        {({ map }) => (
          <Module1 map={map}>
          {({ someFn }) => (
            <Module2 map={map}>
            {({ ... }) => (
              <Module3 map={map}></Module3>
            )}</Module2>
          )}
          </Module1>
        )}
      </Map>
    )
  }
}
```

# Publish to NPM

There are 4 scripts included in this repository for publishing - when you clone this repository you need to check that they are executable:

```sh
chmod +x ./scripts/*
```

If you don't already have an NPM account, [create one](https://www.npmjs.com/login)! Then login from the root of the source code

```sh
npm login
# Enter your username
# Enter your password
# Enter your email address (probably best to use a work email address, since this is public)
```

This project uses [semantic versioning](https://docs.npmjs.com/about-semantic-versioning). This means that package versioning is controlled by 3 numbers: `major.minor.patch`, which in the case of this project means:

- **major** - Users should expect breaking changes
- **minor** - Users should not expect breaking changes
- **patch** - Minor changes, updates, improvements, etc.

With this in mind, 3 scripts are defined in the `package.json` file:

- `publish-patch` - Patch version is bumped, and code is pushed to NPM
- `publish-minor` - Minor version is bumped, and code is pushed to NPM
- `publish-major` - Major version is bumped, and code is pushed to NPM

Running these scripts will provide CLI prompts that you need to answer, and then a new package version will be pushed to NPM. In all cases existing changes are committed prior to version bump, and then the code on that branch is packaged. **Please don't push non-master branch changes to the NPM registry**!! Unless otherwise intended, please run the `publish-patch` script (`npm run publish-patch`).

# @saeon/atlas-client

TODO

## Docker deployment

```
docker build -t atlas-client -f ./src/@saeon/atlas-client/Dockerfile .
```

# @saeon/atlas-api

TODO

## Docker deployment

```
docker build -t atlas-api -f ./src/@saeon/atlas-api/Dockerfile .
```
