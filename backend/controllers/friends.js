import { validationResult, matchedData } from 'express-validator';
import mongoose from 'mongoose';
import HttpError from '../models/http-error.js';
import { Member } from '../models/members.js';

// once the friend request is accepted or rejected delete the db entry

const addFriend = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (result.errors.length > 0) {
      throw new HttpError(JSON.stringify(result.errors), 422);
    }

    const data = matchedData(req);
    const { sender, recipient } = data; // as ID's

    const senderMember = await Member.findById(sender);
    const recipientMember = await Member.findById(recipient);
    if (!senderMember || !recipientMember) {
      throw new HttpError('Cannot find member by id', 404);
    }

    if (
      recipientMember.pendingFriendRequests.some(
        (id) => id.toString() === sender
      )
    ) {
      throw new HttpError('Friend request already sent', 409);
    }

    const newFriendRequest = await Member.findByIdAndUpdate(
      recipient,
      { $push: { pendingFriendRequests: sender } },
      { new: true }
    );

    res.json(newFriendRequest);
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

const getPendingFriendRequests = async (req, res, next) => {
  try {
    if (!req.verifiedMember) throw new HttpError('Unauthorized', 401);

    const foundMember = await Member.findById(req.verifiedMember._id)
      .select('pendingFriendRequests')
      .populate('pendingFriendRequests', 'username firstName');
    if (!foundMember) {
      throw new HttpError('logged in member not found', 404);
    }
    res.json(foundMember.pendingFriendRequests);
  } catch (error) {
    return next(new HttpError(error, error.errorCode || 500));
  }
};

const getAllFriends = async (req, res, next) => {
  try {
    if (!req.verifiedMember) throw new HttpError('Unauthorized', 401);
    const foundMember = await Member.findById(req.verifiedMember._id)
      .select('friends')
      .populate('friends', 'username firstName');
    if (!foundMember) {
      throw new HttpError('logged in member not found', 404);
    }
    res.json(foundMember.friends);
  } catch (error) {}
};

const manageFriendRequest = async (req, res, next) => {
  try {
    const { senderId } = req.params;
    if (!req.verifiedMember) throw new HttpError('Unauthorized', 401);
    const result = validationResult(req);

    if (result.errors.length > 0) {
      throw new HttpError(JSON.stringify(result.errors), 422);
    }

    const data = matchedData(req);
    const { action } = data;

    const recipientMember = await Member.findById(req.verifiedMember._id);
    const senderMember = await Member.findById(senderId);

    if (!senderMember || !recipientMember) {
      throw new HttpError('Cannot find member by id', 404);
    }
    if (!recipientMember.pendingFriendRequests.includes(senderId)) {
      throw new HttpError('Friend request not found!', 404);
    }
    const recipientId = req.verifiedMember._id;

    if (action === 'decline') {
      await Member.findOneAndUpdate(
        { _id: req.verifiedMember._id },
        { $pull: { pendingFriendRequests: senderId } }
      );
      return res.json({ message: 'Friend request declined' });
    } else if (action === 'accept') {
      const session = await mongoose.startSession();
      session.startTransaction();

      await Member.findOneAndUpdate(
        { _id: req.verifiedMember._id },
        {
          $pull: { pendingFriendRequests: senderId },
          $push: { friends: senderId },
        },
        { session }
      );

      await Member.findOneAndUpdate(
        { _id: senderId },
        { $push: { friends: recipientId } },
        { session }
      );

      await session.commitTransaction();
      await session.endSession();
      res.json({ message: 'Friend request accepted!' });
    } else {
      throw new HttpError('You must accept or decline', 422);
    }
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }
    next(new HttpError(error, error.errorCode || 500));
  }
};

export {
  addFriend,
  getPendingFriendRequests,
  manageFriendRequest,
  getAllFriends,
};
