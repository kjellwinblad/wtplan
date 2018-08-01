// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

package main

//go:generate go run "generate_version_str/generate_version_str.go"

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"os/user"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

var (
	durationRegExp                   = regexp.MustCompile(`(?P<notAvailable>\s*NA\s*)|\s*(?:(?P<hours>\d+)h)?\s*(?:(?P<minutes>\d+)m)?\s*`)
	simpleDateRegExp                 = regexp.MustCompile(`\s*(?P<year>\d\d\d\d)(?:-(?P<month>\d\d)(?:-(?P<day>\d\d)(?:T(?P<hour>\d\d)(?:\:(?P<minute>\d\d))?)?)?)?\s*`)
	defaultPostChangeCommandsWithGit = [][]string{[]string{"git", "add", "data.json"}, []string{"git", "commit", "-m", "Change!"}}
	defaultEditorCommands            = []string{"nano"}
	customConfigDir                  = ""
)

const (
	calendarDataFileName = "data.json"
	configDataFileName   = "config.json"
	configDirName        = ".wtplan"
)

type calendarItem struct {
	Date        string `json:"date"`
	Duration    string `json:"duration"`
	Description string `json:"description"`
	ID          int    `json:"id,omitempty"`
}

type config struct {
	EditorCommand                      []string   `json:"editor_command"`
	PostChangeCommands                 [][]string `json:"post_change_commands"`
	AutoAddPostChangeCommandsIfGitRepo bool       `json:"auto_add_post_change_commands_if_git_repo"`
	SyncCommands                       [][]string `json:"sync_commands"`
}

//Implements interface for sorting
type byDate []calendarItem

func (a byDate) Len() int      { return len(a) }
func (a byDate) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a byDate) Less(i, j int) bool {
	iTime := a[i].startDate()
	jTime := a[j].startDate()
	return iTime.Before(jTime)
}

//Helper methods for calendarItem
func (c calendarItem) startDate() time.Time {
	t, _ := time.Parse(time.RFC3339, c.Date)
	t = t.Add(1*time.Microsecond) // Makes sure that a time will not happen between days
	t = t.In(time.Local)
	return t
}

func (c calendarItem) endDate() time.Time {
	match := durationRegExp.FindStringSubmatch(c.Duration)
	if match[1] == "NA" {
		return c.startDate()
	}
	hours, _ := strconv.Atoi(match[2])
	minutes, _ := strconv.Atoi(match[3])
	duration := time.Duration(time.Hour*time.Duration(hours) + time.Minute*time.Duration(minutes))
	return c.startDate().Add(duration).In(time.Local)
}

//Error handling function
func die(msg string) {
	fmt.Fprintf(os.Stderr, "%s\n", msg)
	os.Exit(1)
}

//Functions for handling storage and settings file
func configDir() string {
	if customConfigDir != "" {
		return customConfigDir
	} else {
		usr, err := user.Current()
		if err != nil {
			die(fmt.Sprintf("Could not get home directory: %s", err.Error()))
		}
		return filepath.Join(usr.HomeDir, configDirName)
	}
}

func checkOrCreateConfigDir() {
	_, err := os.Stat(configDir())
	if os.IsNotExist(err) {
		if nil != os.Mkdir(configDir(), os.ModeDir|0700) {
			die(fmt.Sprintf("Error when createing data dir: %s", err.Error()))
		}
	} else if err != nil {
		die(fmt.Sprintf("Error when checking existence of data dir: %s", err.Error()))
	}
}

func createOrReadFileInConfigDir(fileName string, defaultText []byte) []byte {
	_, err := os.Stat(filepath.Join(configDir(), fileName))
	if os.IsNotExist(err) {
		err = ioutil.WriteFile(filepath.Join(configDir(), fileName), defaultText, 0600)
		if err != nil {
			die(fmt.Sprintf("Error when createing data file: %s", err.Error()))
		}
	} else if err != nil {
		die(fmt.Sprintf("Error when checking existence of data file: %s", err.Error()))
	}
	dataFileText, err := ioutil.ReadFile(filepath.Join(configDir(), fileName))
	if err != nil {
		die(fmt.Sprintf("Error when reading file: %s", err.Error()))
	}
	return dataFileText
}

func createOrReadData() []calendarItem {
	checkOrCreateConfigDir()
	dataFileText := createOrReadFileInConfigDir(calendarDataFileName, []byte("[]"))
	calendarItems := make([]calendarItem, 0)
	err := json.Unmarshal(dataFileText, &calendarItems)
	if err != nil {
		die(fmt.Sprintf("Error when parsing data file: %s", err.Error()))
	}
	sort.Sort(byDate(calendarItems))
	for i := range calendarItems {
		calendarItems[i].ID = i + 1
	}
	return calendarItems
}

func createOrReadConfig() config {
	checkOrCreateConfigDir()
	defaultConfig := config{
		EditorCommand:                      defaultEditorCommands,
		PostChangeCommands:                 [][]string{},
		AutoAddPostChangeCommandsIfGitRepo: true,
		SyncCommands:                       [][]string{}}
	b, _ := json.MarshalIndent(defaultConfig, "", "  ")
	configData := createOrReadFileInConfigDir(configDataFileName, b)
	conf := config{}
	json.Unmarshal(configData, &conf)
	_, isGitDirErr := os.Stat(filepath.Join(configDir(), ".git"))
	if isGitDirErr == nil &&
		conf.AutoAddPostChangeCommandsIfGitRepo &&
		len(conf.PostChangeCommands) == 0 {
		conf.PostChangeCommands = defaultPostChangeCommandsWithGit
		b, _ := json.MarshalIndent(conf, "", "  ")
		err := ioutil.WriteFile(filepath.Join(configDir(), configDataFileName), b, 0600)
		if err != nil {
			die(fmt.Sprintf("Error when editing config file: %s", err.Error()))
		}
	}
	return conf
}

func saveCalendarItems(calendarItems []calendarItem) {
	for i := range calendarItems {
		calendarItems[i].ID = 0 // sets to empty value
	}
	b, _ := json.MarshalIndent(calendarItems, "", "  ")
	err := ioutil.WriteFile(filepath.Join(configDir(), calendarDataFileName), b, 0600)
	if err != nil {
		die(fmt.Sprintf("Error when writting data file: %s", err.Error()))
	}
}

func addCalendarItem(items []calendarItem, item calendarItem) []calendarItem {
	items = append(items, item)
	sort.Sort(byDate(items))
	return items
}

//Functions for handling commands

func printReport(startDate time.Time, days int) {
	startDate = time.Date(startDate.Year(), startDate.Month(), startDate.Day()-1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(0, 0, days)
	items := createOrReadData()
	itemsToReport := []calendarItem{}
	for _, item := range items {
		if item.startDate().After(startDate) && item.startDate().Before(endDate) {
			itemsToReport = append(itemsToReport, item)
		}
	}
	day := startDate.AddDate(0, 0, 1)
	for day.Before(endDate) && !day.Equal(endDate) {
		nextDay := day.AddDate(0, 0, 1)
		weekdays := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
		fmt.Printf("=== %s%s %d-%02d-%02d ===\n", weekdays[day.Weekday()], "         "[:9-len(weekdays[day.Weekday()])], day.Year(), day.Month(), day.Day())
		for _, item := range itemsToReport {
			if (item.startDate().After(day) || item.startDate().Equal(day)) && item.startDate().Before(nextDay) &&
				(item.endDate().After(day) || item.endDate().Equal(day)) && item.endDate().Before(nextDay) {
				//Both end and start date are inside day
				if item.startDate().Equal(item.endDate()) {
					fmt.Printf("%02d:%02d ID: %d\n", item.startDate().Hour(), item.startDate().Minute(), item.ID)
				} else {
					fmt.Printf("%02d:%02d-%02d:%02d (Duration %s) ID: %d\n", item.startDate().Hour(), item.startDate().Minute(), item.endDate().Hour(), item.endDate().Minute(), item.Duration, item.ID)
				}
				fmt.Printf("%s\n", item.Description)
			} else if (item.startDate().After(day) || item.startDate().Equal(day)) && item.startDate().Before(nextDay) {
				// Start date in day
				fmt.Printf("%02d:%02d-(->) (Duration %s) ID: %d\n", item.startDate().Hour(), item.startDate().Minute(), item.Duration, item.ID)
				fmt.Printf("%s\n", item.Description)
			} else if (item.endDate().After(day) || item.endDate().Equal(day)) && item.endDate().Before(nextDay) {
				// End date in day
				fmt.Printf("(<-)-%02d:%02d (Duration %s) ID: %d\n", item.endDate().Hour(), item.endDate().Minute(), item.Duration, item.ID)
				fmt.Printf("%s\n", item.Description)
			} else if item.startDate().Before(day) && (item.endDate().After(nextDay) || item.endDate().Equal(nextDay)) {
				//Start date before day and end date after day
				fmt.Printf("(<-)-(->) (Duration %s) ID: %d\n", item.Duration, item.ID)
				fmt.Printf("%s\n", item.Description)
			}
		}
		day = nextDay
	}
}

func runCommands(commands [][]string) error {
	for _, command := range commands {
		cmd := exec.Command(command[0], command[1:]...)
		cmd.Stdout = os.Stdout
		cmd.Stdin = os.Stdin
		cmd.Stderr = os.Stderr
		cmd.Dir = configDir()
		err := cmd.Run()
		if err != nil {
			return err
		}
	}
	return nil
}

func checkDurationString(str string) {
	match := durationRegExp.FindStringSubmatch(str)
	if len(match) == 0 {
		die(fmt.Sprintf(`The duration string "%s" is not formatted correctly.
Examples of correctly formatted duration strings are "NA", "2h", "10m" and "2h10m"`, str))
	}
}

func getCalendarItemFromEditor(initialDateString string, initialDuration string, initialDescription string) calendarItem {
	tmpfile, err := ioutil.TempFile(configDir(), "ADD_CALENDAR_ITEM_TEMP")
	if err != nil {
		die(fmt.Sprintf("Error when creating temp file %s", err.Error()))
	}
	content := []byte(
		fmt.Sprintf(`Timepoint (RFC3339):
%s
##################################
Duration (NA no duration, 1h30m = 1 hour and 30 minutes):
%s
##################################
Description (Write on next line):
%s`, initialDateString, initialDuration, initialDescription))
	_, err = tmpfile.Write(content)
	if err != nil {
		die(fmt.Sprintf("Error when writting temp file: %s", err.Error()))
	}
	err = tmpfile.Close()
	if err != nil {
		die(fmt.Sprintf("Error when closing temp file: %s", err.Error()))
	}
	editorCommand := append(createOrReadConfig().EditorCommand, tmpfile.Name())
	err = runCommands([][]string{editorCommand})
	if err != nil {
		die(fmt.Sprintf(`Error when starting editor command.
Note that you can change the editor command in %s: %s`, configDir(), err.Error()))
	}
	content, err = ioutil.ReadFile(tmpfile.Name())
	if err != nil {
		die(fmt.Sprintf("Error when reading temp file: %s", err.Error()))
	}
	err = os.Remove(tmpfile.Name())
	if err != nil {
		die(fmt.Sprintf("Error when removing temp file: %s", err.Error()))
	}
	stringContent := string(content)
	stringContentLines := strings.Split(stringContent, "\n")
	dateString := stringContentLines[1]
	_, err = time.Parse(time.RFC3339, dateString)
	if err != nil {
		die(fmt.Sprintf(`Could not parse datetime string "%s".
RFC 3339 strings are accepted.
%s`, dateString, err.Error()))
	}
	durationString := stringContentLines[4]
	checkDurationString(durationString)
	descriptionString := strings.Join(stringContentLines[7:], "\n")
	if descriptionString == "" {
		die("Canceling add because description string is empty.")
	}
	item := calendarItem{
		Date:        dateString,
		Duration:    durationString,
		Description: descriptionString}
	return item
}

func runPostChangeCommands() {
	commands := createOrReadConfig().PostChangeCommands
	err := runCommands(commands)
	if err != nil {
		die("Error when running post change commands")
	}
}

func addCommand(args []string) {
	var dateString string
	if len(args) == 0 {
		dateString = time.Now().In(time.Local).Format(time.RFC3339)
	} else {
		dateString = timeFromDateString(args[0]).Format(time.RFC3339)
	}
	durationString := "NA"
	if len(args) >= 2 {
		durationString = args[1]
		checkDurationString(durationString)
	}
	var item calendarItem
	if len(args) >= 3 {
		item = calendarItem{Date: dateString, Duration: durationString, Description: args[2]}
	} else {
		item = getCalendarItemFromEditor(dateString, durationString, "")
	}
	saveCalendarItems(addCalendarItem(createOrReadData(), item))
	runPostChangeCommands()
}

func timeFromDateString(str string) time.Time {
	rfc3339Time, err := time.Parse(time.RFC3339, str)
	if err == nil {
		return rfc3339Time
	}
	match := simpleDateRegExp.FindStringSubmatch(str)
	if len(match) == 0 {
		die(fmt.Sprintf(`Can not parse date %s.
Examples of correctly formatted dates are "2016", "2016-10", "2016-10-20",
"2016-10-20T13, "2016-10-20T13:10" and "2016-11-13T19:05:22+01:00" (RFC3339).", `, str))
	}
	year, _ := strconv.Atoi(match[1])
	month, _ := strconv.Atoi(match[2])
	if month == 0 {
		month = month + 1
	}
	day, _ := strconv.Atoi(match[3])
	if day == 0 {
		day = day + 1
	}
	hour, _ := strconv.Atoi(match[4])
	minute, _ := strconv.Atoi(match[5])
	return time.Date(year,
		time.Month(month),
		day, hour, minute, 0, 0, time.Local)
}

func showCommand(args []string) {
	if len(args) == 0 {
		printReport(time.Now(), 10)
	} else if len(args) == 1 {
		if args[0] == "ALLJSON" {
			items := createOrReadData()
			for i := range items {
				items[i].ID = 0 // sets to empty value
			}
			b, _ := json.MarshalIndent(items, "", "  ")
			fmt.Print(string(b))
			return
		}
		days, err := strconv.Atoi(args[0])
		if err == nil {
			printReport(time.Now(), days)
		} else {
			printReport(timeFromDateString(args[0]), 10)
		}
	} else {
		days, err := strconv.Atoi(args[1])
		if err != nil {
			die(fmt.Sprintf("The number of days argument %s is not an integer", args[1]))
		}
		printReport(timeFromDateString(args[0]), days)
	}
}

func removeItems(calendarItems []calendarItem, ids []int) []calendarItem {
	idsToRemove := make(map[int]bool)
	for _, id := range ids {
		idsToRemove[id] = true
	}
	itemsToSave := []calendarItem{}
	for i := range calendarItems {
		if !idsToRemove[i+1] {
			itemsToSave = append(itemsToSave, calendarItems[i])
		}
	}
	return itemsToSave
}

func removeCommand(args []string) {
	items := createOrReadData()
	idsToRemove := []int{}
	for _, item := range args {
		id, err := strconv.Atoi(item)
		if err != nil {
			die(fmt.Sprintf("Can not parse argument %s as integer", item))
		}
		if id < 1 || id > len(items) {
			die(fmt.Sprintf("The ID %d is outside the range", id))
		}
		idsToRemove = append(idsToRemove, id)
	}
	saveCalendarItems(removeItems(items, idsToRemove))
	runPostChangeCommands()
}

func editCommand(args []string) {
	if len(args) == 0 {
		die("No ID passed to the edit command")
	}
	id, err := strconv.Atoi(args[0])
	if err != nil {
		die(fmt.Sprintf("The ID %s passed to edit is not an integer", args[0]))
	}
	items := createOrReadData()
	if id < 1 || id > len(items) {
		die(fmt.Sprintf("The ID %d is out of range", id))
	}
	itemToEdit := items[id-1]
	newItem := getCalendarItemFromEditor(itemToEdit.Date, itemToEdit.Duration, itemToEdit.Description)
	items = removeItems(items, []int{id})
	saveCalendarItems(addCalendarItem(items, newItem))
	runPostChangeCommands()
}

func gitCommand(args []string) {
	command := append([]string{"git"}, args...)
	runCommands([][]string{command})
}

func webCommand(args []string) {
	command := append([]string{"wtplan-web"}, args...)
	runCommands([][]string{command})
}

func printHelpText() {
	fmt.Println(
		`usage: wtcal <command> [<args>]

       The wtplan commands are:
        show   Show calendar items. Examples:
               wtplan show 10              (shows today and the following 9 days)
               wtplan show 2016-10-30 10   (shows 2016-10-30 and the following 9 days)
               wtplan show 2016-10 10      (shows 2016-10-01 and the following 9 days)
               wtplan show 2016 365        (shows 2016-01-01 and the following 364 days)
        add    Add calendar item. Examples:
               wtplan add    (adds an item using the editor -- see ~/wtplan/config.json)
               wtplan add 2016-10-30                    (adds an item using the editor)
               wtplan add 2016-10-30 NA                 (adds an item using the editor)
               wtplan add 2016-10-30T14:10 1h10m "table tennis"          (adds an item)
        remove Remove calendar item. Examples:
               wtplan remove 7       (removes item with ID 7,
                                     use the show command to show IDs of items)
               wtplan remove 7 5 3   (removes several items)
        edit   Edits calendar item. Examples:
               wtplan edit 7 (edit item with ID 7 using editor)
        git    Run git command in the calendar directory. Example:
               wtplan git remote add origin https://gitlab.com/user/calendar.git
        web    Starts the wtplan web interface. Examples:
               wtplan web         (Starts the web interface at the default port 8005)
               wtplan web --address :8700 --password mypass
                          (Starts the web interface at port 8700 with password mypass)

See man page for more detailed help.`)
	os.Exit(0)
}

func main() {
	helpPtr := flag.Bool("h", false, "get help")
	helpLongPtr := flag.Bool("help", false, "get help")
	versionPtr := flag.Bool("v", false, "show version information")
	versionLongPtr := flag.Bool("version", false, "show version information")
	configDirPtr := flag.String("c", "", "Set the configuration dir")
	configDirLongPtr := flag.String("config_dir", "", "Set the configuration dir")
	flag.Parse()
	if *helpPtr || *helpLongPtr {
		printHelpText()
	}
	if *versionPtr || *versionLongPtr {
		fmt.Println(version)
		os.Exit(0)
	}
	args := os.Args[1:]
	if *configDirLongPtr  != ""{
		customConfigDir = *configDirLongPtr
		args = args[2:]
	}
	if *configDirPtr != "" {
		customConfigDir = *configDirPtr
		args = args[2:]
	}
	if len(args) == 0 {
		printHelpText()
	}
	//Init config dir if it does not exist
	createOrReadConfig()
	//Handle commands
	switch args[0] {
	case "add":
		addCommand(args[1:])
	case "show":
		showCommand(args[1:])
	case "remove":
		removeCommand(args[1:])
	case "edit":
		editCommand(args[1:])
	case "git":
		gitCommand(args[1:])
	case "web":
		webCommand(args[1:])
	default:
		fmt.Printf("%q is not valid command.\n", os.Args[1])
		os.Exit(2)
	}

}
