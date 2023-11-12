package router

import (
	"gunmamon/controller"

	"github.com/labstack/echo/v4"
)

func NewRouter(controller controller.IController) *echo.Echo {
	e := echo.New()
	e.GET("/ok", controller.Ok)
	e.GET("/", controller.IndexHandler)
	return e
}
