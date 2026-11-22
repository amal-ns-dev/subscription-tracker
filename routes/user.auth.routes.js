import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import { getUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/:id', authorize, getUser);
userRouter.put('/:id', (req, res) => res.send({title: 'Update user by id'}));

export default userRouter;
