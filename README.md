# Static Site Generator

This package let you create a static site in a very easy and fast way, you can use markdown files to create the content, and create themes to render the content.

For themes you need to use [handlebars](https://handlebarsjs.com/) to render the data coming from the markdown files (more template types will be available in the near future, like [EJS](https://ejs.co/) for example).

# Usage

After you isntall the package you will have access to a new command called `ssg`, this command will et you interact will all the optiona avaialables, like create a new site, run the build process for new added content, etc.

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
    "pattern": "**/*.{md,html}"
  },
  "build": "docs",
  "theme": "default",
  "paginate": 5,
  "assets": [
    "css",
    "js",
    "images"
  ],
  "site": {
    "title": "Your site tytle",
    "author": "Your name"
  }
}
```
- `data.path (string)`: The content path
- `data.pattern (string)`: The pattern to select the content
- `build (string)`: The path where the build is created
- `theme (string)`: The theme used to build the site
- `paginate (number)`: Define the number of recod per page when pagination is used
- `assets (Array[string])`: Define the assets folders inside the theme directory.  These represent folders that will be copied to the build diretory.
- `site.title (string)`: The site title
- `site.author (string)`: The site author name
