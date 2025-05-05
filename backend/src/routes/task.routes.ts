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
router.get('/', authenticate, async (req, res) => {
  const { createdBy, assignedTo } = req.query;
  console.log('Query Parameters:', { createdBy, assignedTo }); // Log query parameters
  const filter: any = {};
  if (createdBy) filter.createdBy = createdBy;
  if (assignedTo) filter.assignedTo = assignedTo;

  try {
    console.log('Filter:', filter); // Log the filter object
    const tasks = await TaskModel.find(filter);
    console.log('Fetched Tasks:', tasks); // Log fetched tasks
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});
router.put('/:id', authenticate, (req, res) => taskController.updateTask(req, res));
router.delete('/:id', authenticate, (req, res) => taskController.deleteTask(req, res));

export default router;