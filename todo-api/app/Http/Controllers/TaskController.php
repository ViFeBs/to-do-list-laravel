<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Task::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //avoid long text
        $request->validate([
            'title' => 'required|string|max:255',
        ]);
        //storing the tittle of the todo list
        $task = Task::create($request->only('title'));
        return response()->json($task, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $request->validate([
            'title' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean',
        ]);
        
        //searches if the id exists
        $task = Task::findOrFail($id);
        //updating the tittle and adding completed for the task 
        $task->update($request->only('title', 'completed'));
        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //delete a task
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(null, 204);
    }
}
