const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 3000
const MONGODB_URL = "mongodb+srv://macxenonzuri:macxenonzuri123@cluster0.dwd2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

mongoose.connect(MONGODB_URL || 'mongodb://localhost/zuriCRUD', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Connected to database")).catch(err => console.log(err));


const UserSchema = new mongoose.Schema({
    messages: String,
    data: {
        name: String,
        email: String,
        country: String
    }
});

const Users = mongoose.model("User", UserSchema);

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.get('/api/users', (req, res) => {

    Users.find({}, function (err, users) {
        if (err) {
            res.status(500).send({message: err.message})
        }
        res.status(200).send(users);
    });
})

app.post('/api/user', (req, res) => {
    const newUser = new Users({
        data: {
            name: req.body.name,
            email: req.body.email,
            country: req.body.country
        }
    });
    newUser.save((err, result) => {
        if (err) {
            console.log(err)
            newUser.messages = `something went wrong ${err.message}`;
            res.status(500).send(newUser);
        }
        result.messages = "Saved Successfully"
        console.log(result);
        res.status(200).send(result)
    })
});

app.put('/api/users/:id', (req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $set: {
            data: {
                name: req.body.name,
                email: req.body.email,
                country: req.body.country
            }
        }
    }, {new: true}, (err, user) => {
        if (err) {
            return res
                .status(500)
                .send({error: "Document not found", message: err.message})
        }
        user.messages = "Successfully Updated"
        res.status(200).send(user);
    });

});

app.delete("/api/users/:id", (req, res) => {
    Users.findOneAndRemove({_id: req.params.id}, function(err, deletedUser){
        if (err) {
            res.status(500).send(err);
            return
        }

        deletedUser.messages = "User Deleted";
        res.status(200).send(deletedUser);
    });
})

app.listen(port, () => console.log(`running on ${port}`));
