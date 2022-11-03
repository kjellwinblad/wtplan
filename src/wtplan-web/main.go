// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

package main

//go:generate go run include_text/includetext.go

import (
	"crypto/rand"
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os/exec"
	"os"
	"strings"
)

var authenticationTokens []string =  nil
var passwordGiven bool =  true

type addCalendarItemMessage struct {
	Date        string `json:"date"`
	Duration    string `json:"duration"`
	Description string `json:"description"`
	LoginToken  string `json:"loginToken"`
}

type editCalendarItemMessage struct {
	Date        string `json:"date"`
	Duration    string `json:"duration"`
	Description string `json:"description"`
	ID          string `json:"id"`
	LoginToken  string `json:"loginToken"`
}

type removeCalendarItemMessage struct {
	IDs []string `json:"ids"`
	LoginToken  string `json:"loginToken"`
}

type getCalendarItemsMessage struct {
	LoginToken  string `json:"loginToken"`
}

type getLoginTokenMessage struct {
	Password  string `json:"password"`
}

type loginTokenResponseMessage struct {
	LoginToken  string `json:"loginToken"`
}

type logoutMessage struct {
	LoginToken  string `json:"loginToken"`
}

func staticFileHandlerProducer(content string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(content))
	}
}

func runWTPlanCommand(w http.ResponseWriter, loginToken string, command ...string) {
	if authenticate(loginToken, w) {
		cmd := exec.Command("wtplan", command...)
		b, err := cmd.CombinedOutput()
		if err != nil {
			http.Error(w, string(b), 500)
			return
		}
		w.Write(b)
	}
}

func authenticate(loginToken string, w http.ResponseWriter) bool {
	if ! passwordGiven {
		return true
	}
	for i := range(authenticationTokens) {
		if authenticationTokens[i] == loginToken {
			return true;
		}
	}
	http.Error(w, "NOT_AUTHENTICATED", 500)
	return false
}

func loginTokenRequest(password string) func (w http.ResponseWriter, r *http.Request){
	return func (w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var msg getLoginTokenMessage
		err := decoder.Decode(&msg)
		defer r.Body.Close()
		if err != nil {
			http.Error(w, fmt.Sprintf("Could not parse request message %s", err.Error()), 500)
			return
		}
		if msg.Password == password {
			// Create and send back auth token
			token := createNewAuthenticationToken()
			var response loginTokenResponseMessage
			response.LoginToken = token
			b, _ := json.MarshalIndent(response, "", "  ")
			w.Write(b)
		} else {
			http.Error(w, "NOT_AUTHENTICATED", 500)
		}
	}
}

func logoutRequest(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var msg logoutMessage
	err := decoder.Decode(&msg)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not parse request message %s", err.Error()), 500)
		return
	}
	var itemsToSave []string
	for _, token := range(authenticationTokens) {
		if token != msg.LoginToken {
			itemsToSave = append(itemsToSave, token)
		}
	}
	authenticationTokens = itemsToSave
}

func calendarItemsRequest(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var msg getCalendarItemsMessage
	err := decoder.Decode(&msg)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not parse request message %s", err.Error()), 500)
		return
	}
	runWTPlanCommand(w, msg.LoginToken, "show", "ALLJSON")
}

func addCalendarItemRequest(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var msg addCalendarItemMessage
	err := decoder.Decode(&msg)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not parse request message %s", err.Error()), 500)
		return
	}
	runWTPlanCommand(w, msg.LoginToken, "add", msg.Date, msg.Duration, msg.Description)
}

func removeCalendarItemRequest(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var msg removeCalendarItemMessage
	err := decoder.Decode(&msg)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, "Could not parse request message", 500)
		return
	}
	runWTPlanCommand(w, msg.LoginToken, append([]string{"remove"}, msg.IDs...)...)
}

func editCalendarItemRequest(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var msg editCalendarItemMessage
	err := decoder.Decode(&msg)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, fmt.Sprintf("Could not parse request message %s", err.Error()), 500)
		return
	}
	if authenticate(msg.LoginToken, w) {
		runWTPlanCommand(w, msg.LoginToken, "remove", msg.ID)
		runWTPlanCommand(w, msg.LoginToken, "add", msg.Date, msg.Duration, msg.Description)
	}
}

func createNewAuthenticationToken() string {
	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	c := 512
	b := make([]byte, c)
	token := make([]rune, c)
	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("error:", err)
		os.Exit(1)
	}
	for i, _ := range(b) {
		token[i] = letters[(uint32(b[i]) % uint32(len(letters)))]
	}
	if len(authenticationTokens) == 10 {
		newAuthenticationTokens := make([]string, 9, 10)
		copy(newAuthenticationTokens, authenticationTokens[1:10])
		authenticationTokens = newAuthenticationTokens
	}
	tokenStr := string(token)
	authenticationTokens = append(authenticationTokens, tokenStr)
	return tokenStr
}

func main() {
	addressPtr := flag.String("address", "127.0.0.1:8005", "The serve address (default \"127.0.0.1:8005\")")
	passwordPtr := flag.String("password", "", "The password")
	flag.Parse()
	if *passwordPtr == "" {
		passwordGiven = false
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		indexPage := indexDhtml
		if *passwordPtr == "" {
			token := createNewAuthenticationToken()
			indexPage = strings.Replace(indexPage, "NOT_AUTHENTICATED", token, 1)
		}
		w.Write([]byte(indexPage))
	})
	http.HandleFunc("/lib/zepto.js", staticFileHandlerProducer(libDzeptoDjs))
	http.HandleFunc("/component.js", staticFileHandlerProducer(componentDjs))
	http.HandleFunc("/edit_item_view.js", staticFileHandlerProducer(editDitemDviewDjs))
	http.HandleFunc("/main_page.js", staticFileHandlerProducer(mainDpageDjs))
	http.HandleFunc("/flow_view.js", staticFileHandlerProducer(flowDviewDjs))
	http.HandleFunc("/day_list.js", staticFileHandlerProducer(dayDlistDjs))
	http.HandleFunc("/day_list_day.js", staticFileHandlerProducer(dayDlistDdayDjs))
	http.HandleFunc("/day_list_item.js", staticFileHandlerProducer(dayDlistDitemDjs))
	http.HandleFunc("/calendar_item.js", staticFileHandlerProducer(calendarDitemDjs))
	http.HandleFunc("/remote_commands.js", staticFileHandlerProducer(remoteDcommandsDjs))
	http.HandleFunc("/utility_functions.js", staticFileHandlerProducer(utilityDfunctionsDjs))
	http.HandleFunc("/login_view.js", staticFileHandlerProducer(loginDviewDjs))
	http.HandleFunc("/login_token_request", loginTokenRequest(*passwordPtr))
	http.HandleFunc("/calendar_items", calendarItemsRequest)
	http.HandleFunc("/add_calendar_item", addCalendarItemRequest)
	http.HandleFunc("/edit_calendar_item", editCalendarItemRequest)
	http.HandleFunc("/remove_calendar_item", removeCalendarItemRequest)
	http.HandleFunc("/logout", logoutRequest)
	fmt.Println("Starting wtplan web at http://"+*addressPtr)
	http.ListenAndServe(*addressPtr, nil)
}
