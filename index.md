## wtplan - web terminal planner 

wtplan helps you manage a calendar. The calendar can be managed from a
command line interface and/or a web interface. The calendar data is
stored in a simple text file (located in `~/.wtplan` by
default). wtplan integrates with git to make backup and
synchronization between multiple computers convenient.


See the man page ([wtplan.1](/man_page.html)) for more details

Features
--------

* command line interface
* web interface
  * optional password authentication
* git integration
* simple json based data format

Requirements
------------

* golang is required to compile wtplan.
* (optional) git is required if you want to use wtplan's git integration.
* (optional) make makes building and installing more convenient but is not
  required. See the Makefile for how to build without make.

Install
-------

1. Edit the paths in config.mk to fit your system if needed. (wtplan is
   installed into `/usr/local/{bin,share/man/man1}` by default.)
2. Run `make install` as root. (This will build and install wtplan)

License
-------

The MIT/X Consortium License. See the LICENSE file for details.
