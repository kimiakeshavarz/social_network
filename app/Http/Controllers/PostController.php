<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Like;
use App\Models\User;

use App\Models\Follower;
use Illuminate\Support\Facades\Auth;

use JWTAuth;
class PostController extends Controller
{
    function addPost(Request $request){
    	$new_post = new Post;
    	$new_post->image = $request->image;
    	$new_post->caption = $request->caption;
    	$new_post->user_id = JWTAuth::user()->id;

        if(!$new_post->save())
            return 'false';
        $request->image->move(public_path('images/posts'), $new_post->id.'.jpg'); 

        $path = '/images/posts/'.strval($new_post->id).'.jpg';
        Post::where('id',$new_post->id)->update(['image'=>$path]);
 
        
        return Post::where('id',$new_post->id)->first();
    	
    }

    function getAllPosts(Request $request){

        $user_id = JWTAuth::user()->id;
        $followings = Follower::where('Follower',$user_id)->where('accepted',1);
        $ids = array();

        foreach ($followings as $following) {
            array_push($ids,$following->followed);
        }

        $posts = Post::whereIn('user_id',$ids)->get();
        $likes = array();
        $unlikes = array();
        foreach ($posts as $post) {
            
            array_push($likes,Like::where('post_id',$post->id)->where('unlike',False)->get());
            array_push($unlikes,Like::where('post_id',$post->id)->where('unlike',True)->get());


        }
        return json_encode(array($posts,$likes,$unlikes));
    }

    function getUserPosts(Request $request){
        $username = $request->user_id;
        $user_id = User::where('username',$username)->get()[0]->id;
        $posts = Post::where('user_id',$user_id)->get();
        $likes = array();
        $unlikes = array();
        foreach ($posts as $post) {
            
            array_push($likes,Like::where('post_id',$post->id)->where('unlike',False)->get());
            array_push($unlikes,Like::where('post_id',$post->id)->where('unlike',True)->get());


        }
    	return json_encode(array($posts,$likes,$unlikes));
    }

    function removePost(Request $request)
    {
        $user_id = JWTAuth::user()->id;
        $post_id = $request->post_id;

        $result = Post::where('user_id',$user_id)->where('id',$post_id)->delete();
        
        return $result;
    }

}
