package model

type FitResponse struct {
	Point []struct {
		Value []struct {
			IntVal int `json:"intVal"`
		} `json:"value"`
		StartTimeNanos string `json:"startTimeNanos"`
		EndTimeNanos   string `json:"endTimeNanos"`
		DataTypeName   string `json:"dataTypeName"`
	} `json:"point"`
}

type OauthResponse struct {
	Access_token string
	Expires_in   int
	Scope        string
	Token_type   string
}
