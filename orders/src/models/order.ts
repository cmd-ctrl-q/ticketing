import mongoose from 'mongoose';
import { OrderStatus } from '@teds-tickets/common';
import { TicketDoc } from './ticket';

export { OrderStatus };

// An interface that describes the properties that are required to create an Order
interface OrderAttrs {
  userId: string; // typescript types
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An instance of an order.
// An interface that describes the properties that (a saved) Order Document has.
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties that an Order Model has.
// Purpose is for type checking the arguments when creating a new document.
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      // Set to a value in the enum
      enum: Object.values(OrderStatus),
      // Not necessary
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
