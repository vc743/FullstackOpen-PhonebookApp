const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDb');
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(phone){
                return /^\d{2,3}-\d+$/.test(phone);
            },
            message: props => `${props.value} is not a valid phone number,`
        },
    },
});

personSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema);