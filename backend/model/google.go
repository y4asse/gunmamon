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
	MInStartTimeNs string `json:"minStartTimeNs"`
	MaxEndTimeNs   string `json:"maxEndTimeNs"`
	DataSourceId   string `json:"dataSourceId"`
}

type OauthResponse struct {
	Access_token string
	Expires_in   int
	Scope        string
	Token_type   string
}
