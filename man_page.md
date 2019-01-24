# wtplan documentation (man page)

<?

<h1 align="center">WTPLAN</h1>

<a href="#NAME">NAME</a><br>
<a href="#SYNOPSIS">SYNOPSIS</a><br>
<a href="#DESCRIPTION">DESCRIPTION</a><br>
<a href="#OPTIONS">OPTIONS</a><br>
<a href="#COMMAND LINE INTERFACE">COMMAND LINE INTERFACE</a><br>
<a href="#WEB INTERFACE">WEB INTERFACE</a><br>
<a href="#GIT INTEGRATION">GIT INTEGRATION</a><br>
<a href="#AUTHOR">AUTHOR</a><br>
<a href="#REPORTING BUGS">REPORTING BUGS</a><br>
<a href="#COPYRIGHT">COPYRIGHT</a><br>

<hr>


<h2>NAME
<a name="NAME"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em">wtplan VERSION
- keeps track of events with a command line interface or a
web interface</p>

<h2>SYNOPSIS
<a name="SYNOPSIS"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em"><b>wtplan</b>
[[<b>--version</b>] | [<b>-h</b>] | [<b>--help</b>]</p>

<p style="margin-left:11%; margin-top: 1em"><b>wtplan</b>
[<b>-c</b> <i>&lt;path&gt;</i>] | [<b>--config_dir</b>
<i>&lt;path&gt;</i>]]</p>

<p style="margin-left:11%; margin-top: 1em"><b>show</b>
[<i>NUMBER_OF_DAYS</i>] | [<i>ISO_DATE</i>
[<i>NUMBER_OF_DAYS</i>]]</p>

<p style="margin-left:11%; margin-top: 1em"><b>add</b>
[<i>ISO_DATE</i> [<i>DURATION</i> [<i>DESCRIPTION</i>]]]</p>

<p style="margin-left:11%; margin-top: 1em"><b>remove</b>
<i>ID</i> ...</p>

<p style="margin-left:11%; margin-top: 1em"><b>edit</b>
<i>ID</i></p>

<p style="margin-left:11%; margin-top: 1em"><b>git</b>
<i>GIT_PARAMETER</i> ...</p>

<p style="margin-left:11%; margin-top: 1em"><b>web</b>
[<b>--address</b> <i>ADDRESS</i>] [<b>--password</b>
<i>PASSWORD</i>]</p>

<h2>DESCRIPTION
<a name="DESCRIPTION"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em"><b>wtplan</b>
manages a calendar with events. Every event has a start
time, a duration and a description. <b>wtplan</b> provides
both a command line interface (see section <b>COMMAND LINE
INTERFACE</b>) as well as web based interface (see section
<b>WEB INTERFACE</b>). <b>wtplan</b> integrates with git to
make it easy to keep calendar data in-sync between several
computers (see section <b>GIT INTEGRATION</b>). The calendar
data as well as configuration files are by default located
in <i>~/.wtplan</i> but this directory can be changed with
the <b>-c</b> or <b>--config_dir</b> parameters.</p>

<h2>OPTIONS
<a name="OPTIONS"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em"><b>-h</b>,
<b>--help</b></p>

<p style="margin-left:22%;">Shows the help text.</p>

<p style="margin-left:11%;"><b>--version</b></p>

<p style="margin-left:22%;">Shows version information</p>

<p style="margin-left:11%;"><b>-c</b> <i>&lt;path&gt;</i>,
<b>--config_dir</b> <i>&lt;path&gt;</i></p>

<p style="margin-left:22%;">Specifies a directory for the
configuration file and the data file other than the default
<i>~/.wtplan</i>.</p>

<h2>COMMAND LINE INTERFACE
<a name="COMMAND LINE INTERFACE"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em">The command
line interface makes it possible to show and modify the
calendar data from a command line console. The <b>add</b>
command and the <b>edit</b> command may open an editor to
edit the calendar item if not enough arguments are
specified. By default the editor nano is used but this can
be changed using the configuration variable
<i>editor_command</i> in <i>~/wtplan/config.json</i>.</p>

<p style="margin-left:11%; margin-top: 1em">The wtplan
commands are: <b><br>
show</b> Show calendar items. Examples: <b><br>
wtplan show 10</b> (shows today and the following 9 days)
<b><br>
wtplan show 2016-10-30 10</b> (shows 2016-10-30 and the
following 9 days) <b><br>
wtplan show 2016-10 10</b> (shows 2016-10-01 and the
following 9 days) <b><br>
wtplan show 2016 365</b> (shows 2016-01-01 and the following
364 days) <b><br>
add</b> Add calendar item. Examples: <b><br>
wtplan add</b> (adds an item using the editor -- see
~/wtplan/config.json) <b><br>
wtplan add 2016-10-30</b> (adds an item using the editor)
<b><br>
wtplan add 2016-10-30 NA</b> (adds an item using the editor)
<b><br>
wtplan add 2016-10-30T14:10 1h10m &quot;table
tennis&quot;</b> (adds an item) <b><br>
remove</b> Remove calendar item. Examples: <b><br>
wtplan remove 7</b> (removes item with ID 7, <br>
use the show command to show IDs of items) <b><br>
wtplan remove 7 5 3</b> (removes several items) <b><br>
edit</b> Edits calendar item. Examples: <b><br>
wtplan edit 7</b> (edit item with ID 7 using editor) <b><br>
git</b> Run git command in the calendar directory. Example:
<b><br>
wtplan git remote add origin
https://gitlab.com/user/calendar.git <br>
web</b> Starts the wtplan web interface. Examples: <b><br>
wtplan web</b> (Starts the web interface at the default port
8005) <b><br>
wtplan web --address :8700 --password mypass</b> <br>
(Starts the web interface at port 8700 with password
mypass)</p>

<h2>WEB INTERFACE
<a name="WEB INTERFACE"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em">The web
interface is started with the <b>wtplan web</b> command. By
default the web interface listen to port <i>8005</i>. The
web interface can then be accessed by pointing a web browser
to the address <i>http://localhost:8005</i> or
<i>http://0.0.0.0:8005</i>. For example, the command
<b>firefox --new-window http://localhost:8005</b> will open
the web interface using the firefox web browser if it is
installed in your system. The port and address that the web
interface listen to can be changed by specifying the
<b>--address</b> option. The command <b>wtplan web --address
:8700</b> will start the web interface on port 8700 instead
of the default port.</p>

<p style="margin-left:11%; margin-top: 1em">The
<b>--password</b> option can be used to protect the web
interface with a password. Running the command <b>wtplan web
--password mySecretPass</b> will start the web interface
protected by the password <i>mySecretPass</i>.</p>

<h2>GIT INTEGRATION
<a name="GIT INTEGRATION"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em">The purpose of
the git integration is to make it more convenient to
synchronize the calendar data between several computers
using the git version control system. A prerequirement for
using the git integration is that git is installed on your
system.</p>

<p style="margin-left:11%; margin-top: 1em">To initiate a
git repository for your calendar data, run the command
<b>wtplan git init</b>. This will create a git repository in
the default wtplan configuration folder <i>~/.wtplan</i>.
Typically, you want to synchronize your calendar data with a
remote repository. To set this up run <b>wtplan git remote
add origin yourRemoteGitRepo</b>. By default, wtplan will
add and commit changes to the calendar data to the
repository if it detects that <i>~/.wtplan</i> is a git
repository. For example, running the command <b>wtplan add
2016-10-30T14:10 1h10m &quot;table tennis&quot;</b> will run
<b>git add data.json</b> and <b>git commit -m
&quot;Change!&quot;</b> in the <i>~/.wtplan</i> folder after
adding the event. Note that the configuration variable
<i>post_change_commands</i> in <i>~/.wtplan/config.json</i>
will be changed to include those two git commands
automatically when the first calendar change is done after
initializing a git repository in the configuration directory
if the configuration variable
<i>auto_add_post_change_commands_if_git_repo</i> is set to
<b>true</b>. The <i>post_change_commands</i> variable can
then be modified if one wants to run other commands when the
calendar data is changed. For example, setting the
<i>post_change_commands</i> variable to
<i>[[&quot;git&quot;, &quot;add&quot;,
&quot;data.json&quot;], [&quot;git&quot;,
&quot;commit&quot;, &quot;-m&quot;, &quot;Change!&quot;],
[&quot;git&quot;, &quot;push&quot;]]</i> will also run the
<b>git push</b> command after committing the change.</p>

<h2>AUTHOR
<a name="AUTHOR"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em">Kjell Winblad
(kjellwinblad@gmail.com, http://winsh.me)</p>

<h2>REPORTING BUGS
<a name="REPORTING BUGS"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em">Bugs can be
reported at the projects github page
&lt;http://github.com/kjellwinblad/wtplan&gt;</p>

<h2>COPYRIGHT
<a name="COPYRIGHT"></a>
</h2>


<p style="margin-left:11%; margin-top: 1em">Copyright
&Acirc;&copy; 2017 Kjell Winblad. License MIT
&lt;https://opensource.org/licenses/MIT&gt;.</p>
<hr>

?>