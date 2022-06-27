# PHP - Active Jobs w/ Db2

This example uses vanilla (no external libraries other than composer) PHP
with PHP's built-in Db2 functions to grab Active Job data and display the
data to a web browser. The display uses Bootstrap, jQuery, and DataTables
to show a paginated, searchable table of Active Jobs and their data.

## Initialization

Keep in mind this must be run on IBM i, since it is using PHP's built-in
Db2 functions, which require direct access to IBM i Db2.

```
$ git clone git@github.com:IBM/ibmi-oss-examples.git
$ cd ibmi-oss-examples/php/active-jobs-db2
$ composer install
$ cp config/db2.local.php.dist config/db2.local.php
```

Then edit `config/db2.local.php` and fill in the proper username and password.

## Running

```
$ composer run --timeout=0 serve
```

The application should be running on port 8080 now. If the port needs to be
different, it can be changed in the `composer.json`'s `scripts` section.
