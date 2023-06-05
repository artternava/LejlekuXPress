import React, { useState, useEffect } from 'react';
import useAuthToken from '../components/useAuthToken';
import axios from 'axios';

const Contact = () => {
  const { userId } = useAuthToken();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [userId]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:39450/api/User/getall');
      setUsers(response.data);
      console.log(users)
      console.log(userId)
    } catch (error) {
      console.log(error);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(user => user.id.toString() === userId.toString());
    return user ? `${user.firstName} ${user.lastName}` : '';
  };


  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <h1>Hello, {getUserName(userId)}</h1>
            <div>
            <h3>How can we help you?</h3>
            </div>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <input type="text" class="form-control" placeholder="Search"></input>
          </div>
          <div className="row mt-3 justify-content-center">
            <div className="col-3 col-md-2 mb-5">
              <div className="card" style={{height: "100px", backgroundColor:"#C44226"}}>
                <div className="card-body">
                  <h5 className="card-title">Payment Help</h5>
                  <p className="card-text"></p>
                </div>
              </div>
            </div>
            <div className="col-3 col-md-2">
              <div className="card" style={{height: "100px", backgroundColor:"#3BB930"}}>
                <div className="card-body">
                  <h5 className="card-title">Safety & Privacy</h5>
                  <p className="card-text"></p>
                </div>
              </div>
            </div>
              <div className="col-3 col-md-2">
                <div className="card" style={{height: "100px", backgroundColor:"#4989E5"}}>
                  <div className="card-body">
                    <h5 className="card-title">Account Help</h5>
                    <p className="card-text"></p>
                  </div>
                </div>
              </div>
             
            </div>
            <h3 className='text-center mb-4'>Quick Help</h3>
            <div class="accordion mb-5" id="accordionExample" style={{width: '50%'}}>
  <div class="accordion-item ">
  
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Can't reset password
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapsed" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>Having trouble resetting your password?</strong>If you're having trouble resetting your password, don't worry, we're here to assist you. To reset your password, simply click on the 'Can't Reset Password' button on the login page. This will direct you to the password reset page, where you'll be prompted to enter your registered email address. Once you've provided your email address, click on the 'Reset Password' button. You'll receive an email with further instructions on how to reset your password securely. Follow the instructions in the email, which may include clicking on a password reset link or entering a verification code. After successfully verifying your identity, you'll be able to create a new password for your account. Remember to choose a strong and unique password to ensure the security of your account. If you encounter any issues during the password reset process, please reach out to our support team for immediate assistance.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Forgot login information
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Payment methods
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingFour">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
        Shipping address
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
</div>

          </div>
        </div>

        
    </>
  );
};

export default Contact;
