import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { 
    createSubscription,
    getSubscriptionById,
    getUserSubscriptions,
    deleteSubscriptionById,
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.get('/:userId/:subscriptionId', authorize, getSubscriptionById);
subscriptionRouter.delete('/:userId/:subscriptionId', authorize, deleteSubscriptionById);

export default subscriptionRouter;
