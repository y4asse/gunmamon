package model

import "time"

type Commit struct {
	Id        string    `json:"_id"`
	UserId    string    `json:"user_id"`
	Minitue   int       `json:"minitue"`
	CreatedAt time.Time `json:"createdAt"`
}
