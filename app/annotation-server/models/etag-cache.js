const { mongoose } = require("./db");
const { model, Schema } = mongoose;

const { ObjectId } = Schema.Types;

const schema = new Schema({
  etag: String,
  annotationId: ObjectId
});

const ETag = model("ETag", schema);

module.exports = ETag;
