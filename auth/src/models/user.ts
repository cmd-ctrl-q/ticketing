import mongoose, { mongo } from 'mongoose';
import { PasswordManager } from '../services/password';

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
