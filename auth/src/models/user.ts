import mongoose, { mongo } from 'mongoose';

// An interface that describes the properties that are required
// to create a new user. Attrs (atributes)
interface UserAttrs {
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

const User = mongoose.model('User', userSchema);

// builder (enforces typescript to type check mongoose attributes)
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export { User };
