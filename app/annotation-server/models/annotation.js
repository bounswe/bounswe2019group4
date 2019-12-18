const { mongoose } = require("./db");
const { model, Schema } = mongoose;

const schema = new Schema(
  {
    id: String,
    type: {
      type: String
    },
    id: {
      type: String
    },
    body: {
      type: Object
    },
    target: {
      type: String
    },
    "@context": {
      type: String
    }
  },
  { timestamps: { createdAt: "created", updatedAt: "modified" } }
);

const Annotation = model("Annotation", schema);

module.exports = Annotation;
