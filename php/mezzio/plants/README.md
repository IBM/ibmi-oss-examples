# Plants

An example of a reasonably complex Mezzio application using house plants, which includes:

- IBM Db2 communication using laminas/laminas-db w/ IbmDb2 driver,
- A REST API w/ standard Hal+Json and pagination,
- A CLI to set up example data using the same connection and model as the API,
- A web GUI for interacting with plant data.
- DataTables, SweetAlert, and ajax calls in [plants.js](public/assets/scripts/plants.js).

## Getting Started

```bash
$ git clone git@github.com:IBM/ibmi-oss-examples.git
$ cd ibmi-oss-examples/php/mezzio/plants
$ cp config/autoload/db2.local.php.dist config/autoload/db2.local.php
$ # Edit config/autoload/db2.local.php and add credentials 
$ composer install
$ composer development-enable # disable config cache while developing
$ composer mezzio plant:setup-data
$ composer run --timeout=0 serve
```

You can then browse to http://ibmi-ip:8080.

## Application Development Mode Tool

This skeleton comes with [laminas-development-mode](https://github.com/laminas/laminas-development-mode).
It provides a composer script to allow you to enable and disable development mode.

### To enable development mode

**Note:** Do NOT run development mode on your production server!

```bash
$ composer development-enable
```

**Note:** Enabling development mode will also clear your configuration cache, to
allow safely updating dependencies and ensuring any new configuration is picked
up by your application.

### To disable development mode

```bash
$ composer development-disable
```

### Development mode status

```bash
$ composer development-status
```

## Configuration caching

By default, the skeleton will create a configuration cache in
`data/config-cache.php`. When in development mode, the configuration cache is
disabled, and switching in and out of development mode will remove the
configuration cache.

You may need to clear the configuration cache in production when deploying if
you deploy to the same directory. You may do so using the following:

```bash
$ composer clear-config-cache
```

You may also change the location of the configuration cache itself by editing
the `config/config.php` file and changing the `config_cache_path` entry of the
local `$cacheConfig` variable.
