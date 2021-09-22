const Post = require('./post')

const postByTitle = (title) => {
  return Post.findOne({title}).exec()
}

const postsForAuthor = (authorId) => {
  return Post.find({author: authorId}).exec() // author is just an id only when we called populate() we get an object
}

const fullPostById = (id) => {
  return Post.findById(id)
    .populate('author') // without populate it will return only id and not data associated to author
    .populate('similarPosts')
    .exec()
}

const allPostsSlim = (fieldsToSelect) => { // {title: 1, content: -1}
  return Post.find({})
    .select(fieldsToSelect)
    .sort('-createdAt')
    .exec()
}

const postByContentLength = (maxContentLength, minContentLength) => {
  return Post.find({
    contentLength: {$lt: maxContentLength, $gt: minContentLength}
  })
    .exec()
}

const addSimilarPosts = (postId, similarPosts) => { // how you operate on arrays in mongo
  return Post.findByIdAndUpdate(postId, {
    $push: {similarPosts: {$each: similarPosts}}
  },{new: true})
}

module.exports = {
  postByTitle,
  postsForAuthor,
  fullPostById,
  allPostsSlim,
  postByContentLength,
  addSimilarPosts
}
