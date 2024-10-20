var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsersSchema = new Schema(
    {
        username: {type:String, required: true},
        email: {type: String, required: true},
        passwordHash: {type:String, required: true},
        reputation: {type: Number, default: 50},
        isAdmin: {type: Boolean, default: false},
    },
    {timestamps: true}
);

UsersSchema.pre('save', function(next) {
    if (this.isAdmin) {
        this.reputation = 2000;
    }
    next();
});

module.exports = mongoose.model('User', UsersSchema)