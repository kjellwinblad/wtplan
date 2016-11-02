// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

package main

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"strings"
)


func main() {
	cmd := exec.Command("git", "rev-parse", "HEAD")
	buf := new(bytes.Buffer)
	cmd.Stdout = buf
	cmd.Stdin = os.Stdin
	cmd.Stderr = new(bytes.Buffer)
	cmd.Dir = "."
	cmd.Run()
	out, err := os.Create("version.go")
	if err != nil {
		fmt.Println(err)
	}
	out.Write([]byte("package main\n\n"))
	commitId := strings.TrimSpace(buf.String())
	versionStr := "var version = `" + `wtplan ` + os.Getenv("VERSIONSTR")
	if len(commitId) == 0 {
		versionStr = versionStr + "`\n" 
	} else {
		versionStr = versionStr + `

git commit id = ` + commitId + "`"
	}
	out.Write([]byte(versionStr))
}
