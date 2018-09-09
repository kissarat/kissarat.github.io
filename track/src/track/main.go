package main

import (
	"log"
	"net/http"
	"runtime"
	"path"
)

func main() {
	_, filename, _, _ := runtime.Caller(1)
	fs := http.FileServer(path.Dir(filename) + "/../../../public")
	http.Handle("/", fs)

	log.Println("Starting localhost:80")
	http.ListenAndServe(":80", nil)
}
