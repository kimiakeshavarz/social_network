<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
    use Tymon\JWTAuth\Contracts\JWTSubject;
class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public $timestamps = false;

    function getJWTIdentifier()
    {
        return $this->getKey();
    }
    function getJWTCustomClaims()
    {
        return [];
    }
}
