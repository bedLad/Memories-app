import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';   // We get access to the database model we created in postMessage.js

export const getPosts = async (req, res) => {
	const { page } = req.query;
	console.log(page);
	try {
		const LIMIT = 8;
		const startIndex = (Number(page) - 1) * LIMIT;  // get the starting index of every page
		const total = await PostMessage.countDocuments({});
    
		const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
		res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
	}
	catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getPost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await PostMessage.findById(id);
		res.status(200).json(post);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
}

export const getPostsBySearch = async(req, res) => {
	const { searchQuery, tags } = req.query;

	try {
		const title = new RegExp(searchQuery, 'i');
		const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
		res.status(200).json(posts);
	} catch (err) {
		res.status(404).json({ message: error.message });
	}
}
export const createPost = async (req, res) => {
	const post = req.body;
	const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    
  try {
    newPost.save();
    res.status(201).json(newPost);
  }
  catch(error) {
    res.status(409).json({ message: error.message });
  }
}

export const updatePost = async (req, res) => {
	try {
		const { id: _id } = req.params;
		const post = req.body;
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).send('No Post with that id');
		}
		
		const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true });
		res.json(updatedPost);
	} catch (err) {
		console.log(err);
	}
};

export const deletePost = async (req, res) => {
	try {
		const { id: _id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).send('No Post with that id');
		}
		const deletedPost = await PostMessage.findByIdAndRemove(_id);
		res.json(deletedPost);
	} catch (err) {
		console.log(err);
	}
};

export const likePost = async (req, res) => {
	try {
		const { id: _id } = req.params;
		
		// req.userId was populated from the auth.js in middleware
		if (!req.userId) return res.json({ message: "Unauthenticated" });

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(404).send('No Post with that id');
		}
		const post = await PostMessage.findById(_id);

		// checking if user has already liked the post or not
		const index = post.likes.findIndex((id) => id === String(req.userId));
		if (index === -1) {
			// specific user has never liked the post so now like it
			post.likes.push(req.userId);
		} else {
			// specific user has liked the post so now unlike it
			post.likes = post.likes.filter((id) => id !== String(req.userId));
			// post.likes is gonna get populated by all the ids except the id mentioned in the filter
		}

		const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
		res.json(updatedPost);
	} catch (err) {
		console.log(err);
	}
}
