# Bebar prefabs
Bebar commes bundled with a bunch of prefabs you can use in your projects! These are partials and helper functions you can import in you bebar file like this:
``` yaml
helpers:
  - ./node_modules/bebar/helpers/**/*.js
partials:
  - ./node_modules/bebar/partials/**/*.hbs

```
You can also choose to import only the prefabs you are interested in by importing only one ore more of the subfolders available.

List of prefabs
- [Common prefabs](./common)
- [Dev prefabs](./dev)
