import React from 'react';
import ReactDOM from 'react-dom';
import {Container,Card,Image,Row,Col,Nav,Form,Button    } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/fontawesome-free-solid';
class Myposts extends React.Component{

	constructor(props){
        super(props);

        const cookies = new Cookies();
        this.state = {logged_user:cookies.get('logged_user'),posts:[],likes:[],unlikes:[],update_time:new Date()};
        this.getMyPosts();

    }
    getMyPosts(){

        var self = this;
        axios.get('/api/getposts/'+this.state.logged_user.username).then(
        function(response){
            self.setState({posts:response.data[0]});
            self.setState({likes:response.data[1]});
            self.setState({unlikes:response.data[2]});


        });
    }

    getLikes(post_id){
        var self = this;
        axios.get('/api/getlikes/'+post_id).then(
        function(response){
        });
    }
    sendPost(){

    	var caption = $('#caption');
    	var image = this.state.file;

        const formData = new FormData();
        formData.append('caption',caption.val());
        formData.append('image',image);

        var self = this;
        caption.val('');
    	axios.post('/api/addpost',formData,{headers:{"Content-Type": "multipart/form-data"}}).then(function(response){
                         self.getMyPosts();

    	});
    }

    deletePost(post_id){

        var self = this;
        axios.post('/api/removepost/',{post_id:post_id}).then(
            function(response){
                        self.getMyPosts();

            }
        );
    }

    onFileChanged(e){
            this.setState({file:e.target.files[0]});
    }



	render(){

        var self = this;
		return(<div>
                    <Card>
                        <Card.Body>

                            <Form.Control className='mt-2' id='caption' as='textarea' rows='4'/>

                            <Row className='mt-3 w-50'>
                            <Col >
                            <label for='uploadimage' className='btn btn-warning'>Upload Image</label>
                            <Form.File id='uploadimage' hidden onChange={this.onFileChanged.bind(this)}/>
                            </Col>
                            <Col >
                                <Button className='btn-info  ' onClick={this.sendPost.bind(this)}>Send Post</Button>
                                </Col>
                                </Row>
                            
                        </Card.Body>
                    </Card>
                    {self.state.posts.map(
                        function(post,index){
                            var likes = self.state.likes[index];
                            if(likes == undefined)
                                likes = [];

                            var unlikes = self.state.unlikes[index];
                            if(unlikes == undefined)
                                unlikes = [];

                            return(
                            <Card className='mt-3'>
                                <Card.Header>
                                    <Button className="btn-danger btn-close" aria-label="Close" onClick={()=>self.deletePost(post.id)}></Button>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group className='d-flex justify-content-center'>
                                        <img src={post.image} height='200' width='200'/>
                                    </Form.Group>
                                    <Form.Group className='mt-5'>
                                        <p>{post.caption}</p>
                                    </Form.Group>
                                    <Card.Footer>
                                    <Row>
                                        <Col md='4'>
                                            <FontAwesomeIcon  icon='thumbs-up' size="lg"/>
                                            <small> {likes.length}</small>
                                        </Col>
                                        <Col>
                                            <FontAwesomeIcon icon='thumbs-down' size="lg"/>
                                            <small> {unlikes.length}</small>
                                        </Col>
                                    </Row>
                            </Card.Footer>
                                </Card.Body>
                            </Card>
                            );
                        }
                    )}

            </div>);
	}
}

export default Myposts;
