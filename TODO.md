* Make the web interface usable even when there is no connection to
  the server. This can be done by adding a command queue to the web
  interface that can be flushed when the server is accessible again.

* Make it possible to read calendar data from multiple config
  folders. This can be useful if one wants to share a kid's calendar
  with the other parent. This could be implemented by letting one
  specify additional calendar data files when starting the web
  interface. The calendar data from the additional calendar data files
  would then be viewable in a read-only way in the web interface.

* Support for importing calendar data from an iCal formatted calendar
  data file.