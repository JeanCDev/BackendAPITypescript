import { Router } from 'express';
import userController from './controllers/userController';

const routes = Router();

// user routes
routes.get('/login/:user_id', userController.index);
routes.post('/login', userController.save);
routes.delete('/login/:user_id', userController.delete);
routes.put('/login/:user_id', userController.update);

export default routes;