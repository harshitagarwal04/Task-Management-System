import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

export class TaskController {
    constructor(private taskService: TaskService) {}

    async createTask(req: Request, res: Response) {
        try {
            const taskData = req.body;
            const newTask = await this.taskService.createTask(taskData);
            res.status(201).json(newTask);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error creating task';
            res.status(500).json({ message });
        }
    }

    async getTasks(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const tasks = await this.taskService.getTasks(user._id);
            res.status(200).json(tasks);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error fetching tasks';
            res.status(500).json({ message });
        }
    }

    async updateTask(req: Request, res: Response) {
        try {
            const taskId = req.params.id;
            const updatedData = req.body;
            const updatedTask = await this.taskService.updateTask(taskId, updatedData);
            res.status(200).json(updatedTask);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error updating task';
            res.status(500).json({ message });
        }
    }

    async deleteTask(req: Request, res: Response) {
        try {
            const taskId = req.params.id;
            await this.taskService.deleteTask(taskId);
            res.status(204).send();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error deleting task';
            res.status(500).json({ message });
        }
    }
}