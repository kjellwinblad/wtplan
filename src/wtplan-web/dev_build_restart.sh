#!/bin/bash

sigint_handler()
{
    kill $PID
    exit
}

trap sigint_handler SIGINT

while true; do
    go generate
    go build
    ./wtplan-web &
    PID=$!
    inotifywait -e modify -e move -e create -e delete -e attrib -r `pwd`
    kill $PID
done
