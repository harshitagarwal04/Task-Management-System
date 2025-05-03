import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const taskService = new TaskService(TaskModel);
const taskController = new TaskController(taskService);

// Task CRUD routes
router.post('/', authenticate, (req, res) => taskController.createTask(req, res));
router.get('/', authenticate, (req, res) => taskController.getTasks(req, res));
router.put('/:id', authenticate, (req, res) => taskController.updateTask(req, res));
router.delete('/:id', authenticate, (req, res) => taskController.deleteTask(req, res));

export default router;