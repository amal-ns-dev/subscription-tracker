import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js"
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,    
        });

        res.status(201).json({ success: true, data: {subscription, workflowRunId} })
    } catch(err) {
        next(err);
    }
}

export const getSubscriptionById = async (req, res, next) => {
    try {
        if (req.user.id != req.params.userId) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptionId = req.params.subscriptionId;

        if (!subscriptionId) {
            const error = new Error('Subscription Id is missing in the request');
            error.status = 400;
            throw error;
        }

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({success: true, data: subscription});

    } catch(err) {
        next(err);
    }
}

export const deleteSubscriptionById = async (req, res, next) => {
    try {
        if (req.user.id != req.params.userId) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptionId = req.params.subscriptionId;

        if (!subscriptionId) {
            const error = new Error('Subscription Id is missing in the request');
            error.status = 400;
            throw error;
        }

        const deletedSubscription = await Subscription.findByIdAndDelete(subscriptionId);

        if (!deletedSubscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully'
        });

    } catch(err) {
        next(err);
    }
}


export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id != req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});

    } catch(err) {
        next(err);
    }
}
