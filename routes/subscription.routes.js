import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/:id', (req, res) => res.send({title: 'GET a subscription'}));
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', (req, res) => res.send({title: 'Update a subscription'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({title: 'Delete a subscription'}));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

export default subscriptionRouter;
