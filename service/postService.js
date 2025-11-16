const Post = require ("../models/post");
const User = require ("../models/user");


exports.createPost = async (userId, data) => {
     const post = new Post({
         user_id: userId,
         text: data.text,
         image: data.image || null,
     });

     await post.save();

     await User.findByIdAndUpdate(userId, {
         $push: {posts: post.id}
     });

     return post;

};

exports.likePost = async (postId) => {
    const like = await Post.findByIdAndUpdate(
        postId,
        { $inc: {likes: 1} },
        {new: true }
    );

    return like;
}

exports.getMostLikedPosts = async () => {
    const result = await Post.aggregate([
        //sorterer likes
        { $sort: { likes: -1} },
        { $lookup: {
            //navnet på collection i DB
            from: 'users',
            //id navn i posts collection
            localField: 'user_id',
            //id navn i users collection
            foreignField: '_id',
            //output bliver lavet som et array vi kalder 'user'
            as: 'user'
            }
        },
        //unwind ændre array'et til en enkelt objekt
        { $unwind: "$user"},
        {
            //vælger hvad vi sender som resultater, kan også omdømbe felter her
            $project: {
                name: "$user.name",
                text: 1,
                likes: 1
            }
        }
    ]);
    return result;
};

exports.deletePost = async(postId) => {
    const post = await Post.findByIdAndDelete(postId);

    if(!post) {
        return null;
    }
    console.log("post", post)
    console.log("user: ", post.user_id)

    await User.findByIdAndUpdate(post.user_id,
        {$pull: {posts: postId} },
        {new: true}
    );

    return {message: "Post deleted"}
}

exports.getAllPosts = async () => {
    const posts = await Post.find()
        //for at hente post med en brugers navn
        .populate('user_id', 'name')
        //så nyeste posts først
        .sort({timestamp: -1});
    return posts;
};