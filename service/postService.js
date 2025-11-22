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

exports.likePost = async (postId, userId) => {
  const likedPost = await Post.findOneAndUpdate(
      //prøver lave like, men kun hvis userId ikke findes i likedBy
      { _id: postId, likedBy: { $ne: userId } }, //$ne = "not equal" / "not in array". Altså tjek at userId ikke er i likedBy array
      { $push: { likedBy: userId }, $inc: { likes: 1 } }, //selve like delen
      { new: true }
  );

  //gør hvis vi likedPost
  if (likedPost){
      console.log(`User ${userId} liked post ${postId}`);
      return {
          liked: true,
          //Burde ses i f.eks. postman
          message: "Du liked posten!",
          post: likedPost
      };
  }

  //prøver denne hvis likedPost ikke skete
  const unlikedPost = await Post.findOneAndUpdate(
      {_id: postId, likedBy: userId },
      { $pull: { likedBy: userId }, $inc: { likes: -1 } },
      { new: true }
  )

    if (unlikedPost){
        console.log(`User ${userId} unliked post ${postId}`);
        return {
            liked: false,
            message: "Du tilbage trukket din like!", //god dansk 10/10 so proud
            post: unlikedPost
        };
    }

    //sker hvis ingen af de andre skete, f.eks. hvis post måske null
    return null;
};

//const post = await Post.findById(postId)
// const post = await Post.findOneAndUpdate(
//     // Filter, det dokumenter skal vi matche.
//     {
//         _id: postId,
//         likedBy: {$ne: userId} //$ne = "not equal" / "not in array". Altså tjek at userId ikke er i likedBy array
//     },
//     // Hvis filter = true, så definere vi hvad der skal ske, altså vores update
//     {
//         $push: {likedBy: userId},
//         $inc: {likes: 1}
//     },
//     { // Sikre vi returnere det opdateret, og ikke det gamle dokument
//         new: true
//     }
// );
// //Hvis post er null, betyder det at enten findes posten ikke, eller user har allerede liked
// if (!post) {
//     const unchangedPost = await Post.findById(postId);
//     return unchangedPost; // returnere uden ændring
// }
//
// return post; // Like blev tilføjet

    // if (!post) {
    //     return null;
    // }
    //
    // if (post.likedBy.includes(userId)) {
    //     return post;
    // }
    //
    // const like = await Post.findByIdAndUpdate(
    //     postId,
    //     {
    //         $inc: {likes: 1},
    //         $push: {likedBy: userId}
    //     },
    //     {new: true }
    // );
    // return like;


// exports.unlikePost = async (postId, userId) => {
//     // const post = await Post.findById(postId);
//     const post = await Post.findOneAndUpdate(
//         {
//             _id: postId,
//             likedBy: userId
//         },
//         {
//             $pull: {likedBy: userId},
//             $inc: {likes: -1}
//         },
//         {
//             new: true
//         }
//     );
//
//     if(!post){
//         const unchangedPost = await Post.findById(postId);
//         return unchangedPost; // returnere uden ændring
//     }
//     return post; // like fjernet
// };
    //
    // if (!post) {
    //     return null;
    // }
    //
    // const unlike = await Post.findByIdAndUpdate(
    //     postId,
    //     {
    //         $inc: {likes: -1},
    //         $pull: {likedBy: userId}
    //     },
    //     {new: true}
    // );
    // return unlike;


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

exports.deletePost = async(post) => {
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


    await Post.findByIdAndDelete(post._id);

    await User.findByIdAndUpdate(post.user_id,
        {$pull: {posts: post._id} },
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