# Workout Tracker

This is a workout tracker web application.

## Development environment setup

#### Install Node.js and NPM

Node.js should be installed using [NVM](https://github.com/creationix/nvm). NVM is a Node.js version manager and allows you to easily install, switch between and uninstall different Node versions. The currently used version of Node.js can be found in our `package.json` file.

#### Install Yarn

[Yarn](https://yarnpkg.com/) is a much faster dependency manager than NPM created by Facebook.

**We don't recommend installing Yarn via Homebrew as it will also install Node.js if you don't yet have it and you may run into conflicts with what we install via NVM.**

Install Yarn using the following command:

```
npm -g install yarn
```

After installing Yarn, run the command:

```
which yarn
```

You should see output like the following:

```
/Users/{yourUser}/.nvm/versions/node/vX.X.X/bin/yarn
```

#### Starting the application

In order to start the application, we need to install our NPM dependencies, build our assets and start a local development server:

```
yarn start
```

This installs the dependencies from our `package.json` file, builds the app and starts a webpack-dev-server at [http://localhost:9999](http://localhost:9999). Our application uses hot-reloading so any changes made to the application files will be reloaded without a page reload.

To output more information when running the development server, start the application in debug mode with the following command:

```
yarn start:debug
```

#### Environment variables

Our environment variables are set up in the `.env` file. You should not need to change any of these.

#### Linting

This project has a set of ESLint and Sass Lint rules. To run the linter, run the following command:

```
yarn lint
```

The "lint" task is defined in our `package.json` file. It is also run before a commit is allowed.

#### Testing

This project uses [Jest](http://facebook.github.io/jest/docs/api.html#content) for unit testing.

To have the unit tests run on every save to a test file (and to enter an interactive mode), use the command:

```
yarn test:watch
```

To run the unit tests once, use the command:

```
yarn test
```

The unit tests are run before a commit is allowed.
