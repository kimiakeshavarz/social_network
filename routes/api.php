<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LikeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
	Route::post('login', [AuthController::class,"checkLogin"]);
	Route::post('register', [AuthController::class,"checkRegister"]);

Route::group(['middleware'=>'jwt.auth'],function(){
	
	Route::get('getsession',[PostController::class,"getSession"]);

		
		Route::group(['middleware'=>'checkuser'],function(){
			
			Route::post('addpost',[PostController::class,"addPost"]);
			Route::post('removepost',[PostController::class,"removePost"]);

			Route::post('follow',[FollowController::class,"follow"]);
			Route::post('unfollow',[FollowController::class,"unfollow"]);
			
			Route::post('like',[LikeController::class,"like"]);
			Route::post('dislike',[LikeController::class,"unlike"]);
			Route::get('getrequests/{user_id}',[FollowController::class,"getRequests"]);
			Route::post('acceptfollow',[FollowController::class,"acceptFollow"]);



		});

		Route::get('getposts/{user_id}',[PostController::class,"getUserPosts"]);
		
		Route::post('getlikes/{post_id}',[LikeController::class,"like"]);

		Route::get('getposts',[PostController::class,"getAllPosts"]);

		Route::get('getfollowers/{user_id?}',[FollowController::class,"getfollowers"]);
		Route::get('getfollowings/{user_id?}',[FollowController::class,"getfollowings"]);

		Route::get('getusers',[UserController::class,"getUsers"]);
		Route::get('getuserinfo/{username}',[UserController::class,"getUserInfo"]);
		Route::get('getuserinfo/{username}',[UserController::class,"getUserInfo"]);

		Route::get('searchuser/{text?}',[UserController::class,"searchUser"]);

});