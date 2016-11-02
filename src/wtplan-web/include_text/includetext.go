//Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
//License: MIT License, see the LICENSE file

// Code created with the help of Stack Overflow question
// http://stackoverflow.com/questions/17796043/golang-embedding-text-file-into-compiled-executable
// Question by Zvika:
// http://stackoverflow.com/users/1543290/zvika
// Answer by Johan Wikström:
// http://stackoverflow.com/users/702065/johan-wikstr%c3%b6m


package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

// Reads all .html and .js files in the current folder
// and encodes them as strings literals in textfiles.go
func main() {
	fs1, _ := ioutil.ReadDir(".")
	fs2, _ := ioutil.ReadDir("./lib")
	var fs []string
	for i := range fs1 {
		fs = append(fs, fs1[i].Name())
	}
	for i := range fs2 {
		fs = append(fs, filepath.Join("./lib", fs2[i].Name()))
	}
	out, _ := os.Create("textfiles.go")
	out.Write([]byte("package main \n\nconst (\n"))
	for _, f := range fs {
		if strings.HasSuffix(f, ".html") || strings.HasSuffix(f, ".js") {
			stringsToReplace := []string{"/", "_", "-", "."}
			fieldName := f
			for i := range stringsToReplace {
				fieldName = strings.Replace(fieldName, stringsToReplace[i], "D", -1)
			}
			out.Write([]byte(fieldName + " = `"))
			fileContent, err := ioutil.ReadFile(f)
			_, err = io.Copy(out, bytes.NewBufferString(strings.Replace(string(fileContent), "`", "`+\"`\"+`", -1)))
			if err != nil {
				fmt.Println(err)
			}
			out.Write([]byte("`\n"))
		}
	}
	out.Write([]byte(")\n"))
}
