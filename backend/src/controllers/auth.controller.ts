import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.authService.register(req.body);
            return res.status(201).json(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            return res.status(400).json({ message });
        }
    }

    public async loginUser(req: Request, res: Response): Promise<Response> {
        try {
            const token = await this.authService.login(req.body);
            return res.status(200).json({ token });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            return res.status(401).json({ message });
        }
    }
}