import mongoose, { mongo } from 'mongoose';
import { PasswordManager } from '../services/password';

// Attributes of the user model
interface UserAttrs {
  email: string;
  password: string;
}

// A model represents the entire collection of data
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// A document represents a single collection of data
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // manipulates the json representation of the data
    toJSON: {
      transform(_doc, ret) {
        // re-map the _id property
        ret.id = ret._id;
        delete ret._id;
        // remove password from the returning object
        delete ret.password;
        // remove the mongo version from the returning object
        delete ret.__v;
      },
    },
  }
);

// A mongoose middleware function.
// anytime a document is saved, execute this function.
userSchema.pre('save', async function (done) {
  // check if user password is modified
  // prevents an already hashed password from being re-hashed.
  if (this.isModified('password')) {
    // only hash the password if it has been modified.
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

// Type checks properties when creating a new record,
// since there are no type-checking on the attributes that are passed in.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Create user model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
