const mongoose = require('mongoose')
const aws = require('aws-sdk')
const s3 = new aws.S3()
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
}, {
  timestamps: true
})

PostSchema.pre('save', function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`
  }
})

PostSchema.pre('remove', function () {
  const post = this
  const userPosts = post.model('User').findOne({ posts: post._id })
  userPosts.posts.remove(post._id)
  userPosts.save()

  if (process.env.STORAGE_TYPE === 's3') {
    return s3.deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: this.key
    }).promise()
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key)
    )
  }
})

module.exports = mongoose.model('Post', PostSchema)
