const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    state: {
        type: String,
        default: "draft"
    },
    read_count: {
        type: Number,
        required: true
    },
    reading_time: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Blog = model('Blog', blogSchema);

module.exports = Blog;