import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from "react-router-dom";
import
{ Container,Row,Col,Button,Card,InputGroup,Form,FormControl,Alert } 
from 'react-bootstrap';
import Cookies from 'universal-cookie';

class Register extends React.Component{

    constructor(props){
        super(props);
        this.state = {Redirect:false};
    }

    validateRequireds(){
        
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();
        if(!email || !lastname || !username || !password){
            ReactDOM.render(<Alert variant='danger'>All fields must be filled. </Alert>,document.getElementById('alert'));

            return false;
        }

        return true;
    }

    validatePassword(){
        var password = $("#password").val();
        var password2 = $("#password2").val();

        if(password != password2)
        {
            ReactDOM.render(<Alert variant='danger'>passwords not matched</Alert>,document.getElementById('alert'));
            return false;
        }

        if(password.length < 8){
            ReactDOM.render(<Alert variant='danger'>password must be equal or more than 8 characters </Alert>,document.getElementById('alert'));
            return false;
        }

        return true;
    }
    onFileChanged(e){
            this.setState({file:e.target.files[0]});
    }
    onSubmit(){
        
        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var username = $('#username').val();
        var password = $('#password').val();
        var bio = $('#bio').val();
        var email = $('#email').val();
        var profile = this.state.file;

        const formData = new FormData();
        formData.append('firstname',firstname);
        formData.append('lastname',lastname);
        formData.append('username',username);
        formData.append('password',password);
        formData.append('bio',bio);
        formData.append('profile',profile);
        formData.append('email',email);

        var self = this; 

        if(this.validateRequireds() && this.validatePassword())
        axios.post('/api/register',formData,{headers:{"Content-Type": "multipart/form-data"}}).then(
            function(response){
                if(response.status == 200)
                {

                    const cookies = new Cookies();
                    cookies.set('token',response.data.token);
                    cookies.set('logged_user',response.data.logged_user);
                    alert('Your activation link has sent to your email.Check your inbox.');
                    self.setState({Redirect:true});
                }
        }).catch(function(error){
            ReactDOM.render(<Alert variant='danger'>Duplicate Informations.</Alert>,document.getElementById('alert'));

        });   
    }

    render() {    

        if(this.state.Redirect == true){
            return <Redirect to='/dashboard' />;
        }
        return (
            <Container fluid className='p-5'>
                <Row className="d-flex justify-content-center p-5">
                <div id='alert'></div>
                    <Col md='5'>
                        <Card className='bg-light '>
                            <Card.Body>
                            <Card.Title><h5>please fill inputs.</h5></Card.Title>
                            <Form.Group className='mt-5'>
                            <Row>
                            <Col md='6'>
                            <Form.Control id='firstname' placeholder='Firstname' required/>
                            </Col>
                            <Col md='6'>
                            <Form.Control id='lastname' placeholder='Lastname' required/>
                            </Col>
                            </Row>
                            </Form.Group>

                            <Form.Group className='mt-4'>
                            <Form.Control id='username' placeholder='Username' required />
                            </Form.Group>

                            <Form.Group className='mt-4'>
                            <Form.Control id='email' placeholder='Email address'  />
                            </Form.Group>

                            <Form.Group className='mt-4 '  >
                            <Row className='d-flex justify-content-center'>
                            <Col sm='5'>
                            <Form.Control id='password' type='password' placeholder='Password' required/>
                            </Col>
                            <Col sm='5'>
                            <FormControl id='password2' type='password' placeholder='re-type password' required/>
                            </Col>
                            </Row>
                            </Form.Group>

                            <Form.Group className='mt-4'>
                            <Form.Control as='textarea' id='bio' placeholder='Bio' requrired/>
                            </Form.Group>

                            <Form.Group className='m-4 d-flex justify-content-end'>
                            <Form.Label for='picture' className=' btn btn-sm btn-warning'>Select profile</Form.Label >
                            <Form.Control type='file' id='picture' required onChange={this.onFileChanged.bind(this)} hidden/>
                            </Form.Group>
                            <Form.Group className='d-flex justify-content-center'>
                                <button className='btn btn-success btn-lg' onClick={this.onSubmit.bind(this)}>Sign    up</button>
                            </Form.Group>
                            <Card.Link className='mt-3 d-flex justify-content-center'>
                            <a href='/login'>already has an account?</a>
                            </Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            </Container>
        );
    }
}
export default Register;
