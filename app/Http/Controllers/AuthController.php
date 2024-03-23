<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use Session; 
use Mail;
class AuthController extends Controller
{

    function checkLogin(Request $request)
    {   
        $credentials = $request->only('email', 'password');
        $email = $request->email;
        $password = $request->password;
            //$request->session()->put('uer_id',$users[0]->id);
        $token = JWTAuth::attempt(['email'=>$email,'password'=>$password]);
        if($token){
            $user = Auth::user();
            return json_encode(array('logged_user'=>$user,'token'=>$token));
        }
    else{
        abort(401,'Unauthorized action');
    }
    }

    function checkRegister(Request $request)
    {
        $firstname = $request->firstname;
        $lastname = $request->lastname;
        $username = $request->username;
        $password = $request->password;
        $profile = $request->profile;
        $email = $request->email;
        $bio = $request->bio;

    	$users = User::where('username',$username)->orwhere('email',$email)->get();

    	if(count($users) == 0)
    	{
    		$new_user = new User;
    		$new_user->firstname = $firstname;
    		$new_user->lastname = $lastname;
    		$new_user->username = $username;
    		$new_user->email = $email;
    		$new_user->password = Hash::make($password);
            $request->profile->move(public_path('images/profiles'), $username.'.jpg');  
            $new_user->profile = '/images/profiles/'.$username.'.jpg';
            $new_user->bio = $bio;
            $new_user->enabled = False;
    		$new_user->save();
            $token = JWTAuth::fromUser($new_user);
            $link = $request->getHttpHost().'/accept/'.$new_user->id;
            $data = array('activation link :'=>$link);
	        		Mail::raw($link, function ($message) use ($email){
            		$message->to($email);
              		$message->from('laravel@ssnetwork.ir');
 			});
    		return json_encode(array('logged_user'=>$new_user,'token'=>$token));
    	}
    	else
    	{
            abort(401,'Duplicate users');
    	}
    }

    function uploadProfile($uploadpath,$file_data){
        
        move_uploaded_file($file_data,$uploadpath);

    }

    function acceptUser(Request $request){
        $user_id = $request->user_id;

        User::where('id',$user_id)->update(['enabled'=>True]);
        return redirect('/login');
    }
}
