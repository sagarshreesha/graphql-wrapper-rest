const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://shreesha:Srihari108@cluster0-uwnxv.mongodb.net/test?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true});

mongoose.connection.on("connected", err =>{
	if(err) throw err;
	console.log("Connected to DB");
});

const PostSchema = mongoose.Schema({
	title: String,
	content: String,
	author: String,
	timestamp:  String
});

const PostModel = mongoose.model("post", PostSchema);

app.get("/", (req, res) => {
	res.send("Heloo");
});

app.post("/api/posts/new", (req, res) => {
	let payload = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		timestamp: new Date().getTime()
	}
	let newPost = new PostModel(payload);
	newPost.save((err, result) => {
		if(err) res.send({success: false, msg: err});

		res.send({success: true, result: result});
	});
});

app.get("/api/posts/all", (req, res) => {
	PostModel.find((err, result) => {
		if (err) res.send({success: false, msg: err });

		res.send({success: true, result: result });
	});
});

app.post("/api/post/update", (req, res) => {
	let id = req.body._id;
	let payload = req.body;
	PostModel.findByIdAndUpdate(id, payload, (err, result) => {
		if (err) res.send({success: false, msg: err });

		res.send({success: true, result: result});
	});
});

app.post("/api/post/remove", (req, res) => {
	let id = req.body._id;
	PostModel.findById(id).deleteOne((err, result) => {
		if (err) res.send({success: false, msg: err });

		res.send({success: true, result: result});
	});
});

app.listen(process.env.PORT || 3000, err => {
	if(err) console.error(err);
	console.log("Server has started at port %s", process.env.PORT || 3000);
});