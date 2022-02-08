import mongoose, { mongo } from 'mongoose';

// An interface that describes the properties that are required
// to create a new user. Attrs (atributes)
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a user model has.
// E.g. Methods associated with a user model like 'build'.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has.
// Describes the properties of a single user.
// Also contains properties that are auto created by mongoose like 'createdAt'.
interface UserDoc extends mongoose.Document {
  // definition of a UserDoc contains all the properties that a
  // normal mongoose document has and our custom ones.
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// custom function for user model, add to statics property on schema.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
