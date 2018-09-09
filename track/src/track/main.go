package main

import (
	"log"
	"net/http"
	"os"
)

// Static server
func main() {
	//_, filename, _, _ := runtime.Caller(1)
	fs := http.FileServer(http.Dir(os.Args[1]))
	http.Handle("/", fs)

	log.Println("Starting http://localhost:3000")
	http.ListenAndServe(":3000", nil)
}
