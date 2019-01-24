# wtplan documentation (man page)

<?

<H2>NAME</H2>

wtplan 0.1 - keeps track of events with a command line interface or a web interface
<A NAME="lbAC">&nbsp;</A>
<H2>SYNOPSIS</H2>

<B>wtplan</B>

[[<B>--version</B>] | [<B>-h</B>] | [<B>--help</B>]
<P>
<B>wtplan</B> [<B>-c</B> <I>&lt;path&gt;</I>] | [<B>--config_dir</B> <I>&lt;path&gt;</I>]]

<P>
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>&nbsp;show</B>&nbsp;[<I>NUMBER_OF_DAYS</I>]&nbsp;|&nbsp;[<I>ISO_DATE</I>&nbsp;[<I>NUMBER_OF_DAYS</I>]]
<P>
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>&nbsp;add</B>&nbsp;[<I>ISO_DATE</I>&nbsp;&nbsp;[<I>DURATION</I>&nbsp;[<I>DESCRIPTION</I>]]]
<P>
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>&nbsp;remove</B>&nbsp;<I>ID</I>&nbsp;...
<P>
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>&nbsp;edit</B>&nbsp;<I>ID</I>
<P>
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>&nbsp;git</B>&nbsp;<I>GIT_PARAMETER</I>&nbsp;...
<P>
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>&nbsp;web</B>&nbsp;[<B>--address</B>&nbsp;<I>ADDRESS</I>]&nbsp;[<B>--password</B>&nbsp;<I>PASSWORD</I>]
<P>
<A NAME="lbAD">&nbsp;</A>
<H2>DESCRIPTION</H2>

<B>wtplan</B>

manages a calendar with events. Every event has a start time, a duration and a description.
<B>wtplan</B> provides both a command line interface (see section <B>COMMAND LINE INTERFACE</B>) as well as web based interface (see section <B>WEB INTERFACE</B>).
<B>wtplan</B> integrates with git to make it easy to keep calendar data in-sync between several computers (see section <B>GIT INTEGRATION</B>).
The calendar data as well as configuration files are by default located in <I>~/.wtplan</I> but this directory can be changed with the <B>-c</B> or <B>--config_dir</B> parameters.
<A NAME="lbAE">&nbsp;</A>
<H2>OPTIONS</H2>

<DL COMPACT>
<DT><B>-h</B>, <B>--help</B>

<DD>
Shows the help text.
<DT><B>--version</B>

<DD>
Shows version information
<DT><B>-c</B> <B></B><I>&lt;path&gt;</I>, <B>--config_dir</B> <B></B><I>&lt;path&gt;</I>

<DD>
Specifies a directory for the configuration file and the data file other than the default <I>~/.wtplan</I>.
<P>
</DL>
<A NAME="lbAF">&nbsp;</A>
<H2>COMMAND LINE INTERFACE</H2>

The command line interface makes it possible to show and modify the calendar data from a command line console.
The <B>add</B> command and the <B>edit</B> command may open an editor to edit the calendar item if not enough arguments are specified.
By default the editor nano is used but this can be changed using the configuration variable <I>editor_command</I> in <I>~/wtplan/config.json</I>.
<P>
The wtplan commands are:
<BR>&nbsp;<B>show</B>&nbsp;&nbsp;&nbsp;Show&nbsp;calendar&nbsp;items.&nbsp;Examples:
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;show&nbsp;10</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(shows&nbsp;today&nbsp;and&nbsp;the&nbsp;following&nbsp;9&nbsp;days)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;show&nbsp;2016-10-30&nbsp;10</B>&nbsp;&nbsp;&nbsp;(shows&nbsp;2016-10-30&nbsp;and&nbsp;the&nbsp;following&nbsp;9&nbsp;days)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;show&nbsp;2016-10&nbsp;10</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(shows&nbsp;2016-10-01&nbsp;and&nbsp;the&nbsp;following&nbsp;9&nbsp;days)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;show&nbsp;2016&nbsp;365</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(shows&nbsp;2016-01-01&nbsp;and&nbsp;the&nbsp;following&nbsp;364&nbsp;days)
<BR>&nbsp;<B>add</B>&nbsp;&nbsp;&nbsp;&nbsp;Add&nbsp;calendar&nbsp;item.&nbsp;Examples:
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;add</B>&nbsp;&nbsp;&nbsp;&nbsp;(adds&nbsp;an&nbsp;item&nbsp;using&nbsp;the&nbsp;editor&nbsp;--&nbsp;see&nbsp;~/wtplan/config.json)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;add&nbsp;2016-10-30</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(adds&nbsp;an&nbsp;item&nbsp;using&nbsp;the&nbsp;editor)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;add&nbsp;2016-10-30&nbsp;NA</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(adds&nbsp;an&nbsp;item&nbsp;using&nbsp;the&nbsp;editor)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;add&nbsp;2016-10-30T14:10&nbsp;1h10m&nbsp;&quot;table&nbsp;tennis&quot;</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(adds&nbsp;an&nbsp;item)
<BR>&nbsp;<B>remove</B>&nbsp;Remove&nbsp;calendar&nbsp;item.&nbsp;Examples:
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;remove&nbsp;7</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(removes&nbsp;item&nbsp;with&nbsp;ID&nbsp;7,
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;use&nbsp;the&nbsp;show&nbsp;command&nbsp;to&nbsp;show&nbsp;IDs&nbsp;of&nbsp;items)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;remove&nbsp;7&nbsp;5&nbsp;3</B>&nbsp;&nbsp;&nbsp;(removes&nbsp;several&nbsp;items)
<BR>&nbsp;<B>edit</B>&nbsp;&nbsp;&nbsp;Edits&nbsp;calendar&nbsp;item.&nbsp;Examples:
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;edit&nbsp;7</B>&nbsp;(edit&nbsp;item&nbsp;with&nbsp;ID&nbsp;7&nbsp;using&nbsp;editor)
<BR>&nbsp;<B>git</B>&nbsp;&nbsp;&nbsp;&nbsp;Run&nbsp;git&nbsp;command&nbsp;in&nbsp;the&nbsp;calendar&nbsp;directory.&nbsp;Example:
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;git&nbsp;remote&nbsp;add&nbsp;origin&nbsp;<A HREF="https://gitlab.com/user/calendar.git">https://gitlab.com/user/calendar.git</A></B>
<BR>&nbsp;<B>web</B>&nbsp;&nbsp;&nbsp;&nbsp;Starts&nbsp;the&nbsp;wtplan&nbsp;web&nbsp;interface.&nbsp;Examples:
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;web</B>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Starts&nbsp;the&nbsp;web&nbsp;interface&nbsp;at&nbsp;the&nbsp;default&nbsp;port&nbsp;8005)
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>wtplan&nbsp;web&nbsp;--address&nbsp;:8700&nbsp;--password&nbsp;mypass</B>
<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Starts&nbsp;the&nbsp;web&nbsp;interface&nbsp;at&nbsp;port&nbsp;8700&nbsp;with&nbsp;password&nbsp;mypass)
<A NAME="lbAG">&nbsp;</A>
<H2>WEB INTERFACE</H2>

The web interface is started with the <B>wtplan web</B> command.
By default the web interface listen to port <I>8005</I>.
The web interface can then be accessed by pointing a web browser to the address <I><A HREF="http://localhost:8005">http://localhost:8005</A></I> or <I><A HREF="http://0.0.0.0:8005">http://0.0.0.0:8005</A></I>.
For example, the command <B>firefox --new-window <A HREF="http://localhost:8005">http://localhost:8005</A></B> will open the web interface using the firefox web browser if it is installed in your system.
The port and address that the web interface listen to can be changed by specifying the <B>--address</B> option.
The command <B>wtplan web --address :8700</B> will start the web interface on port 8700 instead of the default port.
<P>
The <B>--password</B> option can be used to protect the web interface with a password.
Running the command <B>wtplan web --password mySecretPass</B> will start the web interface protected by the password <I>mySecretPass</I>.
<A NAME="lbAH">&nbsp;</A>
<H2>GIT INTEGRATION</H2>

The purpose of the git integration is to make it more convenient to synchronize the calendar data between several computers using the git version control system.
A prerequirement for using the git integration is that git is installed on your system.
<P>
To initiate a git repository for your calendar data, run the command <B>wtplan git init</B>.
This will create a git repository in the default wtplan configuration folder <I>~/.wtplan</I>.
Typically, you want to synchronize your calendar data with a remote repository.
To set this up run <B>wtplan git remote add origin yourRemoteGitRepo</B>.
By default, wtplan will add and commit changes to the calendar data to the repository if it detects that <I>~/.wtplan</I> is a git repository.
For example, running the command <B>wtplan add 2016-10-30T14:10 1h10m &quot;table tennis&quot;</B> will run <B>git add data.json</B> and <B>git commit -m &quot;Change!&quot;</B> in the <I>~/.wtplan</I> folder after adding the event.
Note that the configuration variable <I>post_change_commands</I> in <I>~/.wtplan/config.json</I> will be changed to include those two git commands automatically when the first calendar change is done after initializing a git repository in the configuration directory if the configuration variable <I>auto_add_post_change_commands_if_git_repo</I> is set to <B>true</B>.
The <I>post_change_commands</I> variable can then be modified if one wants to run other commands when the calendar data is changed.
For example, setting the <I>post_change_commands</I> variable to <I>[[&quot;git&quot;, &quot;add&quot;, &quot;data.json&quot;], [&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, &quot;Change!&quot;], [&quot;git&quot;, &quot;push&quot;]]</I> will also run the <B>git push</B> command after committing the change.
<P>
<A NAME="lbAI">&nbsp;</A>
<H2>AUTHOR</H2>

<P>
Kjell Winblad (<A HREF="mailto:kjellwinblad@gmail.com">kjellwinblad@gmail.com</A>, <A HREF="http://winsh.me)">http://winsh.me)</A>
<P>
<A NAME="lbAJ">&nbsp;</A>
<H2>REPORTING BUGS</H2>

<P>
Bugs can be reported at the projects github page &lt;<A HREF="http://github.com/kjellwinblad/wtplan">http://github.com/kjellwinblad/wtplan</A>&gt;
<P>
<A NAME="lbAK">&nbsp;</A>
<H2>COPYRIGHT</H2>

<P>
Copyright © 2017 Kjell Winblad. License MIT &lt;<A HREF="https://opensource.org/licenses/MIT">https://opensource.org/licenses/MIT</A>&gt;.
<P>

<HR>
<A NAME="index">&nbsp;</A><H2>Index</H2>
<DL>
<DT><A HREF="#lbAB">NAME</A><DD>
<DT><A HREF="#lbAC">SYNOPSIS</A><DD>
<DT><A HREF="#lbAD">DESCRIPTION</A><DD>
<DT><A HREF="#lbAE">OPTIONS</A><DD>
<DT><A HREF="#lbAF">COMMAND LINE INTERFACE</A><DD>
<DT><A HREF="#lbAG">WEB INTERFACE</A><DD>
<DT><A HREF="#lbAH">GIT INTEGRATION</A><DD>
<DT><A HREF="#lbAI">AUTHOR</A><DD>
<DT><A HREF="#lbAJ">REPORTING BUGS</A><DD>
<DT><A HREF="#lbAK">COPYRIGHT</A><DD>
</DL>
<HR>
This document was created by
<A HREF="/cgi-bin/man/man2html">man2html</A>,
using the manual pages.<BR>
Time: 15:56:51 GMT, January 24, 2019

?>