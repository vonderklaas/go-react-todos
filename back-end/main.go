package main

import (
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID int `json:"id"`
	Title string `json:"title"`
	Done bool `json:"done"`
	Body string `json:"body"`
}

func main() {

	app := fiber.New()

	// Cors for React Application
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	todos := []Todo{}

	app.Get("/healthcheck", func(context *fiber.Ctx) error {
		return context.SendString("OK")
	})

	app.Get("/api/todos", func(context *fiber.Ctx) error {
		return context.JSON(todos)
	})

	app.Get("/api/todos/length", func(context *fiber.Ctx) error {
		return context.JSON(len(todos))
	})

	app.Post("/api/todos", func(context *fiber.Ctx) error {
		todo := &Todo{}
		if err := context.BodyParser(todo); err != nil {
			return err
		}
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)
		return context.JSON(todos)
	})

	app.Patch("/api/todos/:id/done", func(context *fiber.Ctx) error {
		id, err := context.ParamsInt("id")
		if err != nil {
			return context.Status(401).SendString("Invalid ID, try again!")
		}
		for i, todo := range todos {
			if todo.ID == id {
				todos[i].Done = !todos[i].Done
				break
			}
		}
		return context.JSON(todos)
	})

	app.Delete("/api/todos/:id", func(context *fiber.Ctx) error {
		id, err := context.ParamsInt("id")
		if err != nil {
			return context.Status(401).SendString("Invalid ID, try again!")
		}
		for i, todo := range todos {
			if todo.ID == id {
				todos = append(todos[:i], todos[i+1:]...)
				break;
			}
		}
		return context.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))

}