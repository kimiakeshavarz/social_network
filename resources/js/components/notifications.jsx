import React from 'react';
import ReactDOM from 'react-dom';
import { Container,Row,Col,Button,Card,InputGroup,Form,FormControl,Alert }from 'react-bootstrap';
import Cookies from 'universal-cookie';

class Notifs extends React.Component{

constructor(props)
{
	super(props);

	const cookies = new Cookies();
	this.state = {requests:[],lastuser:0,logged_user:cookies.get('logged_user')};
	this.getRequests(this.state.user_id);

}

getUserInfo(user_id){
	
	for(let i=0;i<this.state.requests.length;i++)
	{
		if(this.state.requests[i].id == user_id)
			return this.state.requests[i];
	}
}

getRequests(user_id){

	var self = this;
	axios.get("/api/getrequests/"+this.state.logged_user.id).then(
			function(response){
				self.setState({requests:response.data});
			});
}

follow(follower_id,followed_id){
	
	var self = this;
	axios.post("/api/acceptfollow/",{follower_id:follower_id,followed_id:followed_id}).then(
	function(response){
				self.getRequests();
	});
}

unfollow(follower_id,followed_id){
	
	var self = this;
	axios.post("/api/unfollow/",{follower_id:follower_id,followed_id:followed_id}).then(
	function(response){
				self.getRequests();

	});
}

render()
{
	var self = this;

	if(this.state.requests.length <= 0)
		return(<div className='mt-3'><h3>No requests yet</h3></div>);
	return (self.state.requests.map(function(request){
		console.log(request);
		var user = self.getUserInfo(request.id); 
		return(<Card className='mt-4'>
		<Card.Body>
		<Row>
		<Col md='7'>{user.firstname} {user.lastname} has requested to follow you.</Col>
		<Col md='2'><Button className='primary btn-sm' onClick={()=>self.follow(user.id,self.state.logged_user.id)} roundedCircle>Accept</Button></Col>
		<Col md='2'><Button className='primary btn-sm' onClick={()=>self.unfollow(user.id,self.state.logged_user.id)} roundedCircle>Reject</Button></Col>

		</Row>
		</Card.Body>
		</Card>);
	}));
}
}
export default Notifs;