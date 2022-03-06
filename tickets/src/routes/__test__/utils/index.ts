import mongoose from 'mongoose';

const createMongoID = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

export { createMongoID };
