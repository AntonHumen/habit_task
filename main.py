from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List


app = FastAPI(title="Habit Tracker")

templates = Jinja2Templates(directory="templates")

class Habit(BaseModel):
    id: int
    name: str
    completed: bool = False

class HabitCreate(BaseModel):
    name: str

habits: List[Habit] = []
next_id = 1

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/habits/", response_model=Habit)
def add_habit(habit_in: HabitCreate):
    global next_id
    habit = Habit(id=next_id, name=habit_in.name)
    habits.append(habit)
    next_id += 1
    return habit

@app.get("/habits/", response_model=List[Habit])
def get_habits():
    return habits

@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    for habit in habits:
        if habit.id == habit_id:
            habits.remove(habit)
            return {"message": f"Habit {habit_id} deleted"}
    raise HTTPException(status_code=404, detail="Habit not found")

@app.put("/habits/{habit_id}/complete", response_model=Habit)
def complete_habit(habit_id: int):
    for habit in habits:
        if habit.id == habit_id:
            habit.completed = True
            return habit
    raise HTTPException(status_code=404, detail="Habit not found")

