import { Model, Types } from 'mongoose';
import { Task } from '../models/task.model';

export class TaskService {
    constructor(private taskModel: Model<Task>) {}

    async createTask(taskData: Partial<Task>) {
        const task = new this.taskModel(taskData);
        return await task.save();
    }

    async getTasks(userId: Types.ObjectId | string) {
        return await this.taskModel.find({ assignedTo: userId });
    }

    async updateTask(taskId: string, updateData: Partial<Task>) {
        return await this.taskModel.findByIdAndUpdate(taskId, updateData, { new: true });
    }

    async deleteTask(taskId: string) {
        return await this.taskModel.findByIdAndDelete(taskId);
    }

    async getOverdueTasks(userId: Types.ObjectId | string) {
        const today = new Date();
        return await this.taskModel.find({ assignedTo: userId, dueDate: { $lt: today }, status: { $ne: 'completed' } });
    }
}