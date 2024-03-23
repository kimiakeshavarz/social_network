import React from 'react';
import ReactDOM from 'react-dom';
import {Container,Card,Image,Row,Col,Nav,Form,Button,Tab,Tabs} from 'react-bootstrap';
import Select from 'react-select';
import MyPosts from './myposts.jsx';
import Notifs from './notifications.jsx';
import { withRouter,Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/fontawesome-free-solid';

class Profile extends React.Component{

	constructor(props){
        super(props);

        const cookies = new Cookies();

        this.state = {posts:[1],followings:false,followers:false,options:[],current_user:[],logged_user:cookies.get('logged_user'),Redirect:false,likes:[],dislikes:[]};



    }

    componentDidMount(){

    	axios.interceptors.request.use(function (config) {

    		const cookies = new Cookies();
    		config.headers.Authorization =  "Bearer "+cookies.get('token');

   			return config;
		});

		if(this.state.logged_user.enabled == false){
			alert('You have to activate your account');
			this.setState({Redirect:true});

		}
        if(this.state.logged_user === undefined){

            this.setState({Redirect:true});
	
        }
        else
        {
        	this.getAllUsers();
	        this.getCurrentUser();
	        this.getPosts();

        }
    }
	getAllUsers(){
	
		var self = this;
        axios.get("/api/searchuser/").then(function(response){

        self.setState({options:response.data});
    }).catch(function(error){

       			self.setState({Redirect:true})
        });

	}

	isFollowed(){
		
		for(let i =0;i<this.state.followers.length;i++)
		{	

				if(this.state.followers[i].id == this.logged_user.id)
				return true;
			
		}
		return false;
	}


	goUserProfile(e){
		window.location.href = '../'+e.value;	
	}
    getPosts(){

    	var self = this;
    	var url_parts = window.location.href.split('/');
    	var last_part = (url_parts[url_parts.length-1]);

    	if(last_part == 'dashboard' || window.location.pathname=='/dashboard/myposts')
    	{
        	axios.get("/api/getposts/").then(function(response){
                self.setState({posts:response.data[0]});
                self.setState({likes:response.data[1]});
                self.setState({dislikes:response.data[2]});

            }).catch(function(error){

       			self.setState({Redirect:true})
        });
        }
        else
        {
        	axios.get("/api/getposts/"+last_part).then(function(response){
                self.setState({posts:response.data[0]});
                self.setState({likes:response.data[1]});
                self.setState({dislikes:response.data[2]});

            }).catch(function(error){

       			self.setState({Redirect:true})
        }); 
        }
    }

    getFollowings(user_id){

        var self = this;
        axios.get("/api/getfollowings/"+user_id).then(function(response){

                self.setState({followings:response.data});
 																																																																																											          ;
    }).catch(function(error){

       			self.setState({Redirect:true})
        });
    }

    getFollowers(user_id){

        var self = this;
        axios.get("/api/getfollowers/"+user_id).then(function(response){
                self.state.followers = response.data;
            }).catch(function(error){

                self.setState({followers:response.data});
        });
    }

    getCurrentUser(){

    	var self = this;
    	console.log(this.state.logged_user);
    	var url_parts = window.location.pathname.split('/');
        if(url_parts[url_parts.length-2] == 'profile')
        {
        	var username = (url_parts[url_parts.length-1]);

        	if(username == this.state.logged_user.username){
        		window.location.href = '/dashboard/myposts';
        		return;
        	}
        	axios.get("/api/getuserinfo/"+username).then(function(response){
                
                self.setState({current_user:response.data});
                self.getFollowers(response.data.id);
               	self.getFollowings(response.data.id);


            }).catch(function(error){

       			self.setState({Redirect:true})
        });		

        }
        else
        {
            this.setState({current_user:this.state.logged_user});

            this.getFollowers(this.state.logged_user.id);
            this.getFollowings(this.state.logged_user.id);

        }


    }

    getFollowingUser(user_id){

        for(let i =0;i<this.state.followings.length;i++){
            if(this.state.followings[i].id == user_id)
            {
                return this.state.followings[i];
            }
        }
        return false;
    }

   	follow(){

   		var self = this;
   		axios.post('/api/follow/',{following_id:this.state.current_user.id,follower_id:this.state.logged_user.id}).then(
   		function(response){
			self.getPosts();

   		}).catch(function(error){

       			self.setState({Redirect:true})
        });
	}

	unfollow(){

		var self = this;



		axios.post('/api/unfollow/',{following_id:this.state.current_user.id,follower_id:this.state.logged_user.id}).then(
   		function(response){
			self.getPosts();

   		}).catch(function(error){

       			self.setState({Redirect:true})
        });
	}

	like(e){

		var self = this; 
		var post_id = e.target.id.split('_')[1];

		axios.post('/api/like',{post_id:post_id,user_id:this.state.logged_user.id}).then(
		function(response){
			self.getPosts();
		}).catch(function(error){

       			self.setState({Redirect:true})
        });
	}

	dislike(e){

		var self = this; 
		var post_id = e.target.id.split('_')[1];
		axios.post('/api/dislike',{post_id:post_id,user_id:this.state.logged_user.id}).then(
		function(response){
			self.getPosts();
		}).catch(function(error){

       			self.setState({Redirect:true})
        });
	}

	isLiked(index){

		if(this.state.likes[index] != undefined)
		for(let i=0;i<this.state.likes[index].length;i++){
			if(this.state.likes[index][i].user_id == this.state.logged_user.id)
				return <small>You have liked this post!</small>;
		}

		if(this.state.dislikes[index] != undefined)
		for(let i=0;i<this.state.dislikes[index].length;i++){
			console.log(this.state.likes[index][i]);
			if(this.state.dislikes[index][i].user_id == this.state.logged_user.id)
				return <small>You have disliked this post!</small>;
		}
		return false;
	}
	canShowMyPosts(){
		return (this.state.current_user.id == this.state.logged_user.id && window.location.pathname == '/dashboard/myposts');
	}
	render(){   

        var self = this;
        var current_user = this.state.current_user;
        var user_profile = this.state.current_user.profile;
		 
		if(this.state.Redirect == true)
		{
			alert('your Login has expired');
			return <Redirect to='/login' />;
		}
		return(<Container fluid className='bg-secondary h-100 w-100 p-3 '>
        <Row>
<Row className='d-flex justify-content-center'>
			<Select className='w-100' onChange={this.goUserProfile.bind(this)} options={this.state.options} id='search-select' value="sv"   placeholder="Search user..." />
        </Row>

        <Row className='w-100 h-100 p-3'> 
        <Col>
        <Card className='bg-info'>
        {this.state.logged_user.id == this.state.current_user.id?<Card.Header>
        <Row className='w-50'>
        	<Col>
        		<Nav.Link href='/dashboard' ><small className='text-white'>New Posts</small></Nav.Link>
        	</Col>
        	<Col>
        		<Nav.Link href='/dashboard/myposts'><small className='text-white'>My Posts</small></Nav.Link>
        	</Col>
        </Row>
        </Card.Header>:<div></div>}
        <Card.Body >
        {self.canShowMyPosts() ? <MyPosts/> :this.state.posts.map(
        function(post,index){

        	var likes = self.state.likes[index];
        	var dislikes = self.state.dislikes[index];
            var user = self.getFollowingUser(post.user_id);
            console.log(self.isLiked(index));
            if(current_user.id == post.user_id)
    			user = self.state.current_user;

            var image = post.image;

            return <Card className=' mt-3 d-flex justify-contents-center'>
            <Card.Header><Row>
            <Col md='2'>
            <Image src={image} width='80' height='80' roundedCircle/>
            </Col>
            <Col className='h-50'>
            <Row className='h-50'>
            <Nav.Link href={user.profile}><b><h4 className='text-dark'>{user.firstname} {user.lastname}</h4></b></Nav.Link>
            </Row>
            </Col>
            </Row></Card.Header>
            <Card.Body >
            <Image src={post.image}
             thumbnail />
             <div className='mt-5'>
             <p>{post.caption}</p>
             </div>                                                
             <Card.Footer>
                                    <Row>
                                      <Col lg='8' className='mt-2'>{self.isLiked(index)}</Col>
                                        <Col  >
                                        <Button className='btn-success' onClick={self.like.bind(self)} id={'like_'+post.id}>
                                            <FontAwesomeIcon  icon='thumbs-up'  size="lg"/>
                                            </Button >
                                            <Button id={'dislike_'+post.id}  onClick={self.dislike.bind(self)} className='m-1 btn-danger'>
                  							<FontAwesomeIcon  icon='thumbs-down'  size="lg"/>
                                            </Button>
                                        </Col>
                                    </Row>
            </Card.Footer>
                            </Card.Body>
            </Card>;
        }
        )}
        </Card.Body>
        </Card>
        </Col>
        <Col md='5'>
                       <Card className='bg-light h-100'>
            <Card.Body >
			  <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" >
			  <Tab eventKey="profile" title="Profile">
			  <Card className='mt-4 bg-muted'>
			  <Card.Body>

                <Card.Title>
                			       <Form.Group className=' m-3 d-flex justify-content-center'>
                    <Image src={user_profile}  height='170' width='170' roundedCircle/>
				</Form.Group><Form.Group className='mt-1 d-flex justify-content-center'>
                    <h1 className='text-dark'>{current_user.firstname} {current_user.lastname}</h1>
                </Form.Group>
                    <Form.Group className='mt-1 d-flex justify-content-center'>
                    <h4 className='text-secondary'>@{current_user.username}</h4>
                    </Form.Group></Card.Title>
                <Form.Group className='mt-5 p-3'>
                    <h4 className='text-dark'>{current_user.bio}</h4>
                </Form.Group>
                {this.state.current_user.id == this.state.logged_user.id?<div></div>:
                <Form.Group>
                	{!self.isFollowed()?<Button id='follow' onClick={this.follow.bind(this)}>Follow</Button>:<Button id='unfollow' onClick={this.unfollow.bind(this)}>UnFollow</Button>}
                </Form.Group>}
                </Card.Body>

                <Card.Footer className='p-2'>
                <Row >
                <Col className='ms-5'>
                    <h5 className='text-info'>{this.state.followers.length} Followers</h5>
                </Col>
                <Col>
                    <h5 className='text-info'>{this.state.followings.length} Followings</h5>

                </Col>
                </Row>
                </Card.Footer>
                </Card>
                </Tab>
              		{this.state.logged_user.id==this.state.current_user.id?<Tab eventKey="home" title="Requests">
    					<Notifs />
  					</Tab>:<div></div>}
            	</Tabs>
            </Card.Body>

        </Card>
        </Col>
                </Row>	

      </Row></Container>);
	}
}

export default withRouter(Profile);
