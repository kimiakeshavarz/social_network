<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
class LikeController extends Controller
{
    function like(Request $request){
    	
        $user_id = $request->user_id;
        $post_id = $request->post_id;
        $unlike = Like::where('user_id',$user_id)->where('post_id',$post_id)->first();

        if($unlike != Null){
            $unlike->delete();

            $like = new Like;
            $like->user_id = $user_id;
            $like->post_id = $post_id;
            $like->unlike = False;
            $like->save();
    	return 'true';
    }
}

    function unlike(Request $request){

        $user_id = $request->user_id;
        $post_id = $request->post_id;

    	$like = Like::where('user_id',$user_id)->where('post_id',$post_id)->first();
        if($like != Null){
            
            $like->delete();
        }   

            $new_like = new Like;
            $new_like->post_id = $post_id;
            $new_like->user_id = $user_id;
            $new_like->unlike = True;
            $new_like->save();

        return 'true';
    }

    function getLikes(Request $request)
    {
        $post_id = $request->post_id;

        return Like::where('post_id',$post_id)->get()->toJson();
    }
}
