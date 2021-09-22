const mongoose = require('mongoose')
const Project = require('./project')
const cdnUrl = 'https://cdn.adminapp.com'

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subscription: {
    status: {
      type: String,
      required: true,
      default: ['active'],
      enum: ['active', 'trialing', 'overdue', 'canceled']
    },
    last4: {
      type: Number,
      min: 4,
      max: 4
    }
  }
})

// if the org was removed then all the projects that are associated with that org
orgSchema.post('remove', async (doc, next) => {
  await Project.remove({org: doc._id}).exec()
  next()
})

orgSchema.virtual('avatar').get(function() { // on schema object
  return `${cdnUrl}/${this._id.toString()}`
})

module.exports = mongoose.model('org', orgSchema)

// virtuals -> not saved in database, computed when we asked for it
// .id in place of ._id -> built in virtual (.id)
// virtuals are defined on schema objects
// add getters or setters
// use regular function and not arrow function with getters
// don't put async code inside virtuals, keep synchronous

// middleware
// pre-save, pre-validation, post-save and many more..-> middleware or hooks
// validations run before save or pre-save

// sync
// orgSchema.pre('save', function(){
//     console.log("before save")
// })

// async
// orgSchema.pre('save', function(doc, next){
//     setTimeour(function(){
//        console.log("before save", doc)
//        next();
//     }, 300)
// })