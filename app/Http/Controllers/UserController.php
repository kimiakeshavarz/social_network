<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
class UserController extends Controller
{
	function startsWith ($string, $startString)
	{
    	$len = strlen($startString);
    	return (substr($string, 0, $len) === $startString);
	}

    function getUserInfo(Request $request){
        $username = $request->username;
    	return User::where('username',$username)->get()[0]->toJson();
    }

    function getUsers(){
    	return User::all()->toJson();
    }

    function searchUser(Request $request){
        $text = $request->text;
    	$users = User::all();
    	$matched_users = array();
    	foreach ($users as $user) {

    	   if($text == Null || $this->startsWith($user->firstname,$text) || $this->startsWith($user->lastname,$text) || $this->startsWith($user->username,$text) ){

                $item = array();
                $item['label'] = ' @'.$user->username;
                $item['value'] = 'profile/'.$user->username;
			    array_push($matched_users,$item);
            }

    	}

    	return json_encode($matched_users);
    }


}
