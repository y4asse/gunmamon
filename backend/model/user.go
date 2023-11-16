package model

type User struct {
	Id           string `json:"_id"`
	CreatedAt    string `json:"createdAt"`
	RefreshToken string `json:"refreshToken"`
}
