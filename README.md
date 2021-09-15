# Static Site Generator

![Node CI](https://github.com/aagamezl/static-site-generator/workflows/Node%20CI/badge.svg)
![npm (scoped)](https://img.shields.io/npm/v/@devnetic/static-site-generator)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@devnetic/static-site-generator?color=red)
![npm](https://img.shields.io/npm/dt/@devnetic/static-site-generator)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![GitHub issues](https://img.shields.io/github/issues-raw/devnetic/static-site-generator)
![GitHub](https://img.shields.io/github/license/devnetic/static-site-generator)

This package let you create a static site in a very easy and fast way, you can use markdown files to create the content, and create themes to render the content.

The themes use [handlebars](https://handlebarsjs.com/) to render the data coming from the markdown files, this template system is easy to use but powerful enough to almost every necessary task, but in case that you need extra features, you can write your own addons or [helpers](https://handlebarsjs.com/guide/#custom-helpers) for handlebars.

To do this, add your new helpers in the `./template-systems/register.js`.  Below you can see how a new helper would be registered:

```javascript
const templateSystem = require('./template/templateSystem')

const handlebars = templateSystem.getSystem('handlebars').system

handlebars.registerHelper('loud', (value) => {
    return value.toUpperCase()
})
```

Another option is to implement and/or register a totally new template systems like [EJS](https://ejs.co/) for example.  To do this you only need to follow the necessary conventions that the generator expects:

Create a new file in the `./template-system` directory with the following code (this example use EJS, but should the same for other template systems):

```javascript
// Import the NPM package for the template template engine
const ejs = require('ejs')

/**
 * Compile the template and return the compiled result.
 *
 * @param {string} template
 * @param {object|Array} data
 * @return {string}
 */
const compile = (template, data) => {
  return ejs.render(template, data)
}

/**
 * Export the EJS template system.
 *
 * @return {object}
 */
const template = () => {
  return {
    name: 'ejs',  // Required: this is the name to setup in the config file
    system: ejs,  // Required: this is necessary for possible extensions
    compile       // Required: this function is called by the generator
  }
}

module.exports = {
  template
}
```

The compile and template function signature must always be the same.  Now you need to setup the generator to use your new template system, to do this, modify the `config.json` file:

```json
{
  ...,
  "templateSystem": "ejs",
  ...,
}
```

# Usage

After you install the package you will have access to a new command called `ssg`, this command will et you interact will all the optiona avaialables, like create a new site, run the build process for new added content, etc.

Using the `-h` or `--help` modifier you can get all the available options:

```bash
$ ssg -h | ssg --help

Usage: ssg <option> [modifier]

Options:
  -b, --build           Run the build process
  -c, --clean           Clean the build directory
  -n, --new             Generate a new site
  -v, --version         Display version
  -w, --watch           Run the build process watching changes
  -h, --help            Show this help


Copyright 2021 - Static Site Generator
```

The `-n`, `--new` will create the necessary directories and a config file with some initial values to run your new site.

A typical config file will have the next structure:

```json
{
  "data": {
    "path": "content",
    "files": [
      ".md",
      ".html",
      ".mdx"
    ]
  },
  "build": "docs",
  "theme": "default",
  "paginate": 5,
  "templateSystem": "handlebars",
  "assets": [
    ".css",
    ".js",
    ".gif",
    ...,
    ".wma",
    ".aac"
  ],
  "site": {
    "title": "Your site tytle",
    "author": "Your name"
  }
}
```

- `data.path (string)`: The content path.
- `data.files (string[])`: The files to be includes like content for the site.
- `build (string)`: The path where the build is created.
- `theme (string)`: The theme used to build the site.
- `paginate (number)`: Define the number of recod per page when pagination is used.
- `templateSystem (string)`: The template system used in the theme files.
- `assets (Array[string])`: Define the assets types inside the theme directory.
- `site.title (string)`: The site title.
- `site.author (string)`: The site author name.
