package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
)

func main() {
	fs := http.FileServer(http.Dir(os.Args[1]))
	http.Handle("/", fs)
	http.HandleFunc("/report/", func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.String())
	})

	port, err := strconv.Atoi(os.Args[2])
	if nil != err {
		panic(err)
	}
	strPort := strconv.Itoa(port)
	log.Println("Starting http://localhost:" + strPort)
	http.ListenAndServe(":" + strPort, nil)
}
