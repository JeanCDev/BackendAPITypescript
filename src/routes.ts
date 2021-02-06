import { Router } from 'express';
import userController from './controllers/userController';
import messageController from './controllers/messageController';
import projectController from './controllers/projectController';
import uploads from './controllers/imageController';
import verifyToken from './config/verifyToken';

const routes = Router();

// user routes
routes.post('/login', verifyToken, userController.save);
routes.post('/login-validation', userController.validate);
routes.get('/login', verifyToken, userController.index);
routes.get('/login/:user_id', verifyToken, userController.get);
routes.delete('/login/:user_id', verifyToken, userController.delete);
routes.put('/login/:user_id', verifyToken, userController.update);

// messages routes
routes.post('/messages', messageController.save);
routes.get('/messages', verifyToken, messageController.index);
routes.get('/messages/:message_id', verifyToken, messageController.get);
routes.delete('/messages/:message_id', verifyToken, messageController.delete);

// projects routes
routes.post('/projects', [verifyToken, uploads.single('image')], projectController.save);
routes.get('/projects', projectController.index);
routes.get('/projects/:project_id', projectController.get);
routes.put('/projects/:project_id', [verifyToken, uploads.single('image')], projectController.update);
routes.delete('/projects/:project_id', verifyToken, projectController.delete);

//routes.get('/test', testing.index)
export default routes;