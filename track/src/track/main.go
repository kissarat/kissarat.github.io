package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
	"database/sql"
	"regexp"
	"io/ioutil"
	"strings"
)

//const METHODS = []string{"UNKNOWN", "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT"}
var regexToken = regexp.MustCompile("kissarat_track=([^;]+)")
const pidFilename = "/tmp/track.pid"

const schema = `create table report (
  id     integer primary key autoincrement,
  ip     text,
  url    text not null,
  agent  text,
  "data" text,
  token  text
)`

func open() *sql.DB {
	db, err1 := sql.Open("sqlite3", "track.sqlite")
	if nil != err1 {
		panic(err1)
	}
	db.Exec(schema)
	//var count int
	//db.QueryRow("SELECT count(*) FROM sqlite_master WHERE name = 'report'", &count)
	//if 0 == count {
	//	_, err2 := db.Exec(schema)
	//	if nil != err2 {
	//		panic(err2)
	//	}
	//}
	return db
}

func main() {
	ioutil.WriteFile(pidFilename, []byte(strconv.Itoa(os.Getpid())), 0644)
	db := open()
	fs := http.FileServer(http.Dir(os.Args[1]))
	http.Handle("/", fs)
	http.HandleFunc("/report/", func(w http.ResponseWriter, r *http.Request) {
		m := regexToken.FindStringSubmatch(r.Header.Get("Cookie"))
		token := ""
		if len(m) >= 2 {
			token = m[1]
		}
		data, err0 := ioutil.ReadAll(r.Body)
		if nil == err0 {
			_, err1 := db.Exec("INSERT INTO report (url, agent, token, data, ip) VALUES ($1, $2, $3, $4, $5)",
				r.URL.String()[7:],
				r.Header.Get("User-Agent"),
				token,
				string(data),
				strings.Split(r.RemoteAddr, ":")[0])
			if nil != err1 {
				log.Println(err1)
			}
			w.WriteHeader(http.StatusOK)
		} else {
			log.Println(err0)
			w.WriteHeader(http.StatusInternalServerError)
		}
	})

	port, err := strconv.Atoi(os.Args[2])
	if nil != err {
		panic(err)
	}
	strPort := strconv.Itoa(port)
	log.Println("Starting http://localhost:" + strPort)
	http.ListenAndServe(":"+strPort, nil)
	//db.Close()
	//err2 := os.Remove(pidFilename)
	//if nil != err2 {
	//	fmt.Println("Cannot delete pid file " + pidFilename)
	//}
}
