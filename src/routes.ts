import { Router } from 'express';
import userController from './controllers/userController';
import messageController from './controllers/messageController';

const routes = Router();

// user routes
routes.post('/login', userController.save);
routes.post('/login-validation', userController.validate);
routes.get('/login', userController.index);
routes.get('/login/:user_id', userController.get);
routes.delete('/login/:user_id', userController.delete);
routes.put('/login/:user_id', userController.update);

routes.post('/messages', messageController.save);
routes.get('/messages', messageController.index);
routes.get('/messages/:message_id', messageController.get);
routes.delete('/messages/:message_id', messageController.delete);

export default routes;