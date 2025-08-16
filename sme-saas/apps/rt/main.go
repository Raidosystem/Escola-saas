package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

// Simple hub broadcasting messages by channel (turma) coming from Redis pub/sub

type Client struct {
	conn *websocket.Conn
	channel string
}

var (
	clients = make(map[*Client]struct{})
	redisClient *redis.Client
)

func main() {
	redisURL := os.Getenv("UPSTASH_REDIS_REST_URL") // expecting standard redis:// not REST for go-redis; adapt if needed
	redisToken := os.Getenv("UPSTASH_REDIS_REST_TOKEN")
	if redisURL == "" {
		log.Println("WARN: redis URL not set; realtime disabled")
	} else {
		opts, err := redis.ParseURL(redisURL)
		if err != nil {
			log.Fatalf("invalid redis url: %v", err)
		}
		if redisToken != "" {
			opts.Password = redisToken
		}
		redisClient = redis.NewClient(opts)
		go subscribeRedis()
	}

	http.HandleFunc("/ws", wsHandler)
	port := os.Getenv("RT_PORT")
	if port == "" { port = "8081" }
	log.Printf("Realtime service listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	tokenEnv := os.Getenv("RT_AUTH_TOKEN")
	if tokenEnv != "" { // enforce auth if configured
		authHeader := r.Header.Get("Authorization")
		queryToken := r.URL.Query().Get("auth")
		valid := false
		if strings.HasPrefix(authHeader, "Bearer ") && strings.TrimPrefix(authHeader, "Bearer ") == tokenEnv { valid = true }
		if queryToken == tokenEnv { valid = true }
		if !valid {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
	}
	channel := r.URL.Query().Get("channel")
	if channel == "" { http.Error(w, "channel required", http.StatusBadRequest); return }
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil { return }
	client := &Client{conn: c, channel: channel}
	clients[client] = struct{}{}
	log.Printf("client joined channel=%s", channel)
	c.SetReadLimit(512)
	c.SetPongHandler(func(string) error { return nil })
	go pingLoop(client)
	for {
		_, msg, err := c.ReadMessage()
		if err != nil { break }
		// optional: allow clients to publish messages to channel via redis
		if redisClient != nil {
			redisClient.Publish(context.Background(), channel, msg)
		}
	}
	c.Close()
	delete(clients, client)
	log.Printf("client left channel=%s", channel)
}

func subscribeRedis() {
	if redisClient == nil { return }
	ctx := context.Background()
	pubsub := redisClient.PSubscribe(ctx, "frequencia:*")
	for {
		msg, err := pubsub.ReceiveMessage(ctx)
		if err != nil { log.Println("redis sub err", err); time.Sleep(time.Second); continue }
		broadcast(msg.Channel, []byte(msg.Payload))
	}
}

func broadcast(channel string, payload []byte) {
	for c := range clients {
		if c.channel == channel {
			c.conn.WriteMessage(websocket.TextMessage, payload)
		}
	}
}

func pingLoop(c *Client) {
	for {
		time.Sleep(25 * time.Second)
		if err := c.conn.WriteControl(websocket.PingMessage, []byte("p"), time.Now().Add(5*time.Second)); err != nil {
			return
		}
	}
}
