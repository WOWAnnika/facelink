const fs = require("fs");
const path = require("path");
const Post = require ("../models/post");
const User = require ("../models/user");


exports.createPost = async (userId, data) => {
    //laver ny instans af Post
    const post = new Post({
         user_id: userId,
         text: data.text,
        //sætter til null hvis ikke modtaget noget billede
         image: data.image || null,
     });
    //gemmer den nye Post i vores mongoDB
     await post.save();

     //tilføjer Post id'et til den bruger der oprettet postet
     //overvej addToSet, kan ikke tilføje duplikationer
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
    //lost in the sauce
    //hvis post har et billede sletter vi det fra vores mappe
    if (post.image) {
        const imagePath = path.join(__dirname, "..", "public", post.image.replace("/img/","img/"));
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Kunne ikke slette billedet: ", err);
        });
    }
    // const post = await Post.findByIdAndDelete(postId);
    //
    // if(!post) {
    //     return null;
    // }
    // console.log("post", post)
    // console.log("user: ", post.user_id)

    //burde ikke behøve findByIdAndDelete da vores middelware laver vores Post DB kald for os
    await post.remove();

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