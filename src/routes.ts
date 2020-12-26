import { Router } from 'express';
import userController from './controllers/userController';
import messageController from './controllers/messageController';
import projectController from './controllers/projectController';
import uploads from './controllers/imageController';

const routes = Router();

// user routes
routes.post('/login', userController.save);
routes.post('/login-validation', userController.validate);
routes.get('/login', userController.index);
routes.get('/login/:user_id', userController.get);
routes.delete('/login/:user_id', userController.delete);
routes.put('/login/:user_id', userController.update);

// messages routes
routes.post('/messages', messageController.save);
routes.get('/messages', messageController.index);
routes.get('/messages/:message_id', messageController.get);
routes.delete('/messages/:message_id', messageController.delete);

// projects routes
routes.post('/projects', uploads.single('image'), projectController.save);
routes.get('/projects', projectController.index);
routes.get('/projects/:project_id', projectController.get);
routes.put('/projects/:project_id', uploads.single('image'), projectController.update);
routes.delete('/projects/:project_id', projectController.delete);
export default routes;