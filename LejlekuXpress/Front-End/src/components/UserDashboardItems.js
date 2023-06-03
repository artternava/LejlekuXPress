import React, { useState, useEffect } from "react";
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBTypography,
  MDBCardImage,
  MDBCardTitle
  } from "mdb-react-ui-kit";
  import axios from 'axios';
  import useAuthToken from './useAuthToken.js';

  //#region PersonalInfo
  function PersonalInfo() {
    const { userId } = useAuthToken();
    const [user, setUser] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      countryCode: '',
    });
    const [countryData, setCountryData] = useState([]);
    const [formErrors, setFormErrors] = useState({
      firstName: false,
      lastName: false,
      email: false,
      phoneNumber: false,
      countryCode: false,
    });
  
    useEffect(() => {
      if (userId) {
        fetchUserDetails();
      }
    }, [userId]);
  
    async function fetchUserDetails() {
      try {
        const response = await axios.get(`http://localhost:39450/api/User/get?id=${userId}`);
        if (response.status === 200) {
          const userData = response.data;
          const phoneNumberParts = userData.phoneNumber.split('-');
          const countryCode = phoneNumberParts[0].substring(1);
          const phoneNumber = phoneNumberParts[1];
  
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: phoneNumber,
            countryCode: countryCode,
          });
        } else {
          console.error('Failed to fetch user details');
        }
  
        const countryResponse = await axios.get('http://localhost:39450/api/Country/getall');
        if (countryResponse.status === 200) {
          const countryData = countryResponse.data;
          setCountryData(countryData);
        } else {
          console.error('Failed to fetch country data');
        }
      } catch (error) {
        console.error('An error occurred while fetching user details or country data', error);
      }
    }
  
    async function updateUserDetails() {
      try {
        const { firstName, lastName, email, phoneNumber, countryCode } = user;
  
        if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '') {
          setFormErrors({
            firstName: firstName ==='',
            lastName: lastName === '',
            email: email === '',
          });
          console.error('Please fill in all required fields');
          return; 
        }
        if (phoneNumber.trim() !== '' && countryCode.trim() === ''){
          setFormErrors({
            countryCode: countryCode === '',
          })
          return;
        };

        if (countryCode.trim() !== '' && phoneNumber.trim() === ''){
          setFormErrors({
            phoneNumber: phoneNumber === '',
          })
          return;
        };

        const formattedPhoneNumber = countryCode && phoneNumber ? `+${countryCode}-${phoneNumber}` : '';
  
        const response = await axios.put(`http://localhost:39450/api/User/update?id=${userId}`, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: formattedPhoneNumber,
          profilePicture: null,
        });
        if (response.status === 200) {
          window.alert('Profile saved successfully');
          console.log('User details updated successfully');
        } else {
          console.error('Failed to update user details');
        }
      } catch (error) {
        console.error('An error occurred while updating user details', error);
      }
    }
  
    function handleInputChange(event) {
      const { name, value } = event.target;
      setUser({ ...user, [name]: value });
      setFormErrors({ ...formErrors, [name]: false });
    }
  
    return (
      <div className="container-userdashboard-tabs">
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">
            <div className="col-md-4 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img
                  className="rounded-circle mt-5"
                  src="https://i.pinimg.com/564x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                  alt="user profile"
                  width="150px"
                />
                <span className="font-weight-bold">{user.firstName}</span>
                <span className="text-black-50">{user.email}</span>
              </div>
            </div>
            <div className="col-md-8 border-right">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Profile Settings</h4>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="firstName" className="labels">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                        placeholder="first name"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleInputChange}
                      />
                      {formErrors.firstName && <div className="invalid-feedback">First name is required.</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lastName" className="labels">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                        placeholder="last name"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleInputChange}
                      />
                      {formErrors.lastName && <div className="invalid-feedback">Last name is required.</div>}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="phoneNumber" className="labels">
                        Phone Number
                      </label>
                      <div className="input-group">
                        <select
                          className={`form-control ${formErrors.countryCode ? 'is-invalid' : ''}`}
                          id="countryCode"
                          name="countryCode"
                          value={user.countryCode}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Country</option>
                          {countryData.map((country) => (
                            <option key={country.code} value={country.phoneCode}>
                              {country.niceName} (+{country.phoneCode})
                            </option>
                          ))}
                        </select>
                        
                        <input
                          type="text"
                          className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
                          id="phoneNumber"
                          placeholder="Phone Number"
                          name="phoneNumber"
                          value={user.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      {formErrors.countryCode && <div className="invalid-feedback">Country code is required.</div>}
                      {formErrors.phoneNumber && <div className="invalid-feedback">Phone number is required.</div>}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="email" className="labels">
                        Email
                      </label>
                      <input
                        type="text"
                        id="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        placeholder="Email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                      />
                      {formErrors.email && <div className="invalid-feedback">Email is required.</div>}
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <button className="btn btn-primary me-2" type="button" onClick={updateUserDetails}>
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );    
  }
//#endregion
  //#region ShippingInfo
function ShippingInfo() {
  const { userId } = useAuthToken();
  const [isAddAddressVisible, setIsAddAddressVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    FirstName: '',
    LastName: '',
    CountryId: '',
    State: '',
    City: '',
    ZipCode: '',
    Address1: '',
    Address2: '',
    UserId: '',
  });
  const [formErrors, setFormErrors] = useState({
    FirstName: false,
    LastName: false,
    CountryId: false,
    State: false,
    City: false,
    ZipCode: false,
    Address1: false,
    Address2: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: false,
    }));
  };

  const toggleAddressForm = () => {
    setIsAddAddressVisible(!isAddAddressVisible);
  }
  useEffect(() => {
    fetchCountries();
    fetchAddresses();
  }, [userId]);

  const getCountryName = (countryId) => {
    const country = countries.find((country) => country.id === countryId);
    return country ? country.niceName : '';
  };
  
  const fetchCountries = async () => {
    try {
      const countryResponse = await axios.get('http://localhost:39450/api/Country/getall');
        if (countryResponse.status === 200) {
          const countryData = countryResponse.data;
          setCountries(countryData);
        } else {
          console.error('Failed to fetch country data');
        }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };
  
  
  const fetchAddresses = async () => {
    try {
      const countryResponse = await axios.get(`http://localhost:39450/api/ShippingAddress/get?UserId=${userId}`);
      if (countryResponse.status === 200) {
        const addressData = countryResponse.data;
        setAddresses(addressData);
        console.log(addressData);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { FirstName, LastName, CountryId, State, City, ZipCode, Address1, Address2, } = newAddress;
    const errors = {
      FirstName: FirstName.length === 0,
      LastName: LastName.length === 0,
      CountryId: CountryId.length === 0,
      City: City.length === 0,
      ZipCode: ZipCode.length === 0,
      Address1: Address1.length === 0,
    };
    setFormErrors(errors);
    if (Object.values(errors).some((value) => value)) {
      return;
    }

    const addressWithUserId = {
      ...newAddress,
      UserId: userId, 
    };

    axios
      .post('http://localhost:39450/api/ShippingAddress/add', addressWithUserId)
      .then((response) => {
        console.log('Registration successful', response.data);
        window.alert('Registration successful');
        window.location.href = '/userdashboard';
      })
      .catch((error) => {
        console.error('Registration failed', error);
        window.alert('Registration failed');
      });
  };

  const deleteAddress = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this address?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:39450/api/ShippingAddress/delete?id=${id}`);
        fetchAddresses();
        window.location.href = '/userdashboard';
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  return (
    <div id="shippingInfo">
      <div id="addressList" style={{ display: isAddAddressVisible ? 'none' : 'block' }}>
        <div className="container-userdashboard-tabs">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              padding: '10px',
              width: '90%',
              backgroundColor: '#fff',
              margin: 'auto',
              borderRadius: '10px',
            }}
          >
            <h1 style={{ fontSize: '35px', fontWeight: '400', padding: '5px' }}>Addresses</h1>
            <button className="btn btn-primary me-2" type="button" onClick={toggleAddressForm}>
              Add Address
            </button>
          </div>
          <div className="container rounded bg-white mt-5 mb-5">
            <div className="row" style={{ backgroundColor: '#bdbdbd' }}>
              <div className="col-md-12">
                <div className="grid-container">
                  {addresses.map((address) => (
                    <div className="grid-item p-3 py-5" id="edit-address">
                      <div className="d-flex justify-content-between align-items-center mb-3 my-3 flex-wrap">
                        <div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-fill me-2"></i>
                          <h6 className="text-right w-100">{address.firstName} {address.lastName}</h6>
                        </div>
                        <div className="d-flex align-items-start">
                          <i className="bi bi-geo-alt-fill me-2"></i>
                          <div>
                            <p>{address.address1}</p>
                            <p>{address.city}, {address.state}, {getCountryName(address.countryId)}</p>
                            <p>{address.zipCode}</p>
                          </div>
                        </div>
                        </div>
                        <div className="w-100">
                          <div className="row mt-2">
                            <div className="col-md-12">
                              <button className="btn btn-danger me-2" type="button" onClick={() => deleteAddress(address.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="add-edit-address"
        style={{ display: isAddAddressVisible ? 'block' : 'none' }}
        className="container-userdashboard-tabs"
      >
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Address</h4>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="firstName" className="labels">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        className="form-control"
                        placeholder="First Name"
                        name="FirstName"
                        value={addresses.FirstName}
                        onChange={handleInputChange}
                      />
                      {formErrors.FirstName && <p className="text-danger">First Name is required</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lastName" className="labels">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        className="form-control"
                        placeholder="Last Name"
                        name="LastName"
                        value={addresses.LastName}
                        onChange={handleInputChange}
                      />
                      {formErrors.LastName && <p className="text-danger">Last Name is required</p>}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="country" className="labels">Country</label>
                      <select
                          className={`form-control ${formErrors.countryCode ? 'is-invalid' : ''}`}
                          id="CountryId"
                          name="CountryId"
                          value={newAddress.CountryId}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.niceName}
                            </option>
                          ))}
                        </select>
                      {formErrors.CountryId && <p className="text-danger">Country is required</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="state" className="labels">State</label>
                      <input
                        type="text"
                        id="state"
                        className="form-control"
                        placeholder="State"
                        name="State"
                        value={addresses.State}
                        onChange={handleInputChange}
                      />
                      {formErrors.State && <p className="text-danger">State is required</p>}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="city" className="labels">City</label>
                      <input
                        type="text"
                        id="city"
                        className="form-control"
                        placeholder="City"
                        name="City"
                        value={addresses.City}
                        onChange={handleInputChange}
                      />
                      {formErrors.City && <p className="text-danger">City is required</p>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="zipcode" className="labels">Zip Code</label>
                      <input
                        type="text"
                        id="zipcode"
                        className="form-control"
                        placeholder="Zip Code"
                        name="ZipCode"
                        value={addresses.ZipCode}
                        onChange={handleInputChange}
                      />
                      {formErrors.ZipCode && <p className="text-danger">Zip Code is required</p>}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="address1" className="labels">Address 1</label>
                      <input
                        type="text"
                        id="address1"
                        className="form-control"
                        placeholder="Address 1"
                        name="Address1"
                        value={addresses.Address1}
                        onChange={handleInputChange}
                      />
                      {formErrors.Address1 && <p className="text-danger">Address 1 is required</p>}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="address2" className="labels">Address 2</label>
                      <input
                        type="text"
                        id="address2"
                        className="form-control"
                        placeholder="Address 2"
                        name="Address2"
                        value={addresses.Address2}
                        onChange={handleInputChange}
                      />
                      {formErrors.Address2 && <p className="text-danger">Address 2 is required</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <button className="btn btn-primary profile-button me-2" type="submit" onClick={handleFormSubmit}>
                    Save Address
                  </button>
                  <button className="btn btn-danger profile-button" onClick={toggleAddressForm}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//#endregion
  //#region PaymentDetails
    function PaymentDetails() {
      const { userId } = useAuthToken();
        const [isPaymentVisible, setIisPaymentVisible] = useState(false);
        const [payment, setPayment] = useState([]);
        const [newPayment, setNewPayment] = useState({
          UserId: '',
          FirstName: '',
          LastName: '',
          CardNumber: '',
          ExpirationDate: '',
          CVV: '',
        });
        const [formErrors, setFormErrors] = useState({
          FirstName: false,
          LastName: false,
          CardNumber: false,
          ExpirationDate: false,
          CVV: false,
        });

        const handleInputChange = (event) => {
          const { name, value } = event.target;
          setNewPayment((prevState) => ({
            ...prevState,
            [name]: value,
          }));
          setFormErrors((prevState) => ({
            ...prevState,
            [name]: false,
          }));
        };

        const toggleAddressForm = () => {
          setIisPaymentVisible(!isPaymentVisible);
        };
        
        useEffect(() => {
          fetchPayment();
        }, [userId]);


        const fetchPayment = async () => {
          try {
            const countryResponse = await axios.get(`http://localhost:39450/api/Payment/get?UserId=${userId}`);
            if (countryResponse.status === 200) {
              const addressData = countryResponse.data;
              setPayment(addressData);
              console.log(addressData);
            }
          } catch (error) {
            console.error('Error fetching addresses:', error);
          }
        };
        const getLastFourDigits = (cardNumber) => {
          if (cardNumber && cardNumber.length >= 4) {
            return cardNumber.slice(-4);
          }
          return cardNumber;
        };
        const handleFormSubmit = (event) => {
          event.preventDefault();
          const { FirstName, LastName, CardNumber, ExpirationDate, CVV, } = newPayment;
          const errors = {
            FirstName: FirstName.length === 0,
            LastName: LastName.length === 0,
            CardNumber: CardNumber.length !== 16,
            ExpirationDate: ExpirationDate.length !== 5,
            CVV: CVV.length !== 3,
          };
          setFormErrors(errors);
          if (Object.values(errors).some((value) => value)) {
            return;
          }
      
          const addressWithUserId = {
            ...newPayment,
            UserId: userId, 
          };
      
          axios
            .post('http://localhost:39450/api/Payment/add', addressWithUserId)
            .then((response) => {
              console.log('Registration successful', response.data);
              window.alert('Registration successful');
              window.location.href = '/userdashboard';
            })
            .catch((error) => {
              console.error('Registration failed', error);
              window.alert('Registration failed');
            });
        };

        const deletePayment = async (id) => {
          try {
            const confirmDelete = window.confirm('Are you sure you want to delete this payment method?');
            if (confirmDelete) {
              await axios.delete(`http://localhost:39450/api/Payment/delete?id=${id}`);
              fetchPayment();
              window.location.href = '/userdashboard';
            }
          } catch (error) {
            console.error('Error deleting address:', error);
          }
        };


        return (
            <div id="shippingInfo">
            <div id="addressList" style={{ display: isPaymentVisible ? 'none' : 'block' }}>
            <div className="container-userdashboard-tabs">
            <div className="d-flex justify-content-between align-items-center" 
            style={{padding: "10px", width: "90%", backgroundColor: "#fff", margin: "auto", borderRadius: "10px", }}>
                <h1 style={{fontSize: "35px", fontWeight: "400", padding: "5px"}}>Payment Methods</h1>
              <button className="btn btn-primary me-2" type="button" onClick={toggleAddressForm} >Add Payment</button>
              </div>
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row" style={{backgroundColor: '#bdbdbd'}}>
                <div className="col-md-12">
                    <div className="grid-container">
                    {payment.map((payment, index) => (
            <div className="grid-item p-3 py-5" id="edit-address">
            <div className=" mb-3">
              <h4 className="text-right">Card: **** **** **** {getLastFourDigits(payment.cardNumber)}</h4>
              <p className="text-right">CardHolder name: <b>{payment.firstName} {payment.lastName}</b></p>

            </div>
            <div className="row mt-2">
              <div className="col-md-12">
              <button className="btn btn-danger me-2" type="button" onClick={() => deletePayment(payment.id)}>Delete</button>
                </div>
            </div>
          </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
            </div>
            <div
                id="add-edit-address"
                style={{ display: isPaymentVisible ? 'block' : 'none' }}
                className="container-userdashboard-tabs">
            <div className="container-userdashboard-tabs">
                <div className="container rounded bg-white mt-5 mb-5">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Payment</h4>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="firstName" className="labels">Card Holder First Name</label>
                                            <input 
                                              type="text" 
                                              id="firstName" 
                                              className="form-control" 
                                              placeholder="First Name"
                                              name="FirstName"
                                              value={payment.FirstName}
                                              onChange={handleInputChange}  
                                              />
                                              {formErrors.FirstName && <p className="text-danger">First Name is required</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="lastName" className="labels">Card Holder Last Name</label>
                                            <input 
                                              type="text" 
                                              id="lastName" 
                                              className="form-control"
                                              placeholder="Last Name" 
                                              name="LastName"
                                              value={payment.LastName}
                                              onChange={handleInputChange} 
                                             />
                                            {formErrors.LastName && <p className="text-danger">Last Name is required</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                    <label htmlFor="CardNumber" className="labels">Card Number</label>
                                    <input 
                                      type="text" 
                                      id="CardNumber" 
                                      className="form-control w-100" 
                                      placeholder="Card Number"
                                      name="CardNumber"
                                      value={payment.CardNumber}
                                      onChange={handleInputChange} 
                                      maxLength={16}
                                      pattern="\d{16}"
                                      required
                                     />
                                    {formErrors.CardNumber && <p className="text-danger">Card Number is required</p>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="expDate" className="labels">Expiration Date</label>
                                        <input 
                                        type="text" 
                                        id="expDate" 
                                        className="form-control" 
                                        placeholder="MM/YY" 
                                        name="ExpirationDate"
                                        value={payment.ExpirationDate}
                                        onChange={handleInputChange} 
                                        maxLength={5}
                                        pattern="\d\d/\d\d"
                                        required
                                      />
                                      {formErrors.ExpirationDate && <p className="text-danger">Expiration Date is required</p>}
                                    </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    
                                    <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="CVV" className="labels">CVV</label>
                                        <input 
                                        type="text" 
                                        id="CVV" 
                                        className="form-control" 
                                        placeholder="CVV"
                                        name="CVV"
                                        value={payment.CVV}
                                        onChange={handleInputChange} 
                                        maxLength={3}
                                        pattern="\d{3}"
                                        required
                                      />
                                      {formErrors.CVV && <p className="text-danger">CVV is required</p>}
                                    
                                    </div>
                                    </div>
                                </div>
                                <div className="mt-5 text-center">
                                    <button className="btn btn-primary me-2" type="submit" onClick={handleFormSubmit}>Save Payment</button>
                                    <button className="btn btn-danger" type="button" onClick={toggleAddressForm}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        );
    }

//#endregion
  //#region Orders

    const orders = [  {
          invoiceNumber: "#Y34XDHR",    
          expectedArrival: "01/12/19",    
          trackingNumber: "234094567242423422898",    
          imageSrc: "https://www.att.com/idpassets/global/devices/phones/apple/apple-iphone-14/carousel/blue/blue-1.png",    
          productName: "Iphone 14",    
          capacity: "64gb",    
          color: "Blue",    
          price: "$1000"  },  
          {    
            invoiceNumber: "#Z56VBFE",    
            expectedArrival: "05/06/19",    
            trackingNumber: "234094567242423422899",    
            imageSrc: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",    
            productName: "Airpods pro 2",    
            capacity: "-",    
            color: "White",    
            price: "$200"  },  
            {    
              invoiceNumber: "#A12RTGS",    
              expectedArrival: "07/08/19",    
              trackingNumber: "234094567242423422900",    
              imageSrc: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-spacegray-select-202206?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1664497359481",    
              productName: "MacBook Pro",    
              capacity: "1tb",    
              color: "Space Gray",    
              price: "$3750"  }];

      function MyOrders() {
        
        return (
          <>
            {orders.map((order) => (
              <section className="" style={{ backgroundColor: "#bdbdbd" }}>
                <MDBContainer className="py-5 h-100">
                  <MDBRow className="justify-content-center align-items-start h-100">
                    <MDBCol size="12">
                      <MDBCard
                        className="card-stepper text-black"
                        style={{ borderRadius: "16px" }}
                      >
                        <MDBCardBody className="p-5">
                          <div className="d-flex justify-content-between align-items-center mb-5">
                            <div>
                              <MDBTypography tag="h5" className="mb-0">
                                INVOICE{" "}
                                <span className="text-primary font-weight-bold">
                                  {order.invoiceNumber}
                                </span>
                              </MDBTypography>
                              <div className="ml-3 d-flex justify-content-between w-100" style={{ marginTop: "10%"}}>
                                <React.Fragment key={order.invoiceNumber}>
                                  <img src={order.imageSrc} alt="product-image" style={{ maxWidth: "50px", marginRight: "5%" }}/>
                                  <p style={{ marginRight: "30%" }}>{order.productName}</p>
                                  <p style={{ marginRight: "30%" }}>{order.capacity ? `Capacity: ${order.capacity}` : ""}</p>
                                  <p style={{ marginRight: "80%" }}>{order.color ? `Color: ${order.color}` : ""}</p>
                                  <h5>{order.price}</h5>
                                </React.Fragment>
                            </div>
                            </div>
                            <div className="text-end">
                              <p className="mb-0">
                                Expected Arrival <span>{order.expectedArrival}</span>
                              </p>
                              <p className="mb-0">
                                USPS{" "}
                                <span className="font-weight-bold">
                                  {order.trackingNumber}
                                </span>
                              </p>
                            </div>
                          </div>
                          <ul
                            id="progressbar-2"
                            className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2"
                          >
                            <li className="step0 active text-center" id="step1"></li>
                            <li className="step0 active text-center" id="step2"></li>
                            <li className="step0 active text-center" id="step3"></li>
                            <li className="step0 text-muted text-end" id="step4"></li>
                          </ul>
      
                          <div className="d-flex justify-content-between">
                            <div className="d-lg-flex align-items-center">
                              <i class="bi bi-file-text fs-1 icon-spacing"></i>
                              <div>
                                <p className="fw-bold mb-1">Order</p>
                                <p className="fw-bold mb-0">Processed</p>
                              </div>
                            </div>
                            <div className="d-lg-flex align-items-center">
                              <i class="bi bi-box-seam-fill fs-1 icon-spacing"></i>
                              <div>
                                <p className="fw-bold mb-1">Order</p>
                                <p className="fw-bold mb-0">Shipped</p>
                              </div>
                            </div>
                            <div className="d-lg-flex align-items-center">
                              <i class="bi bi-truck fs-1 icon-spacing"></i>
                              <div>
                                <p className="fw-bold mb-1">Order</p>
                                <p className="fw-bold mb-0">En Route</p>
                              </div>
                            </div>
                            <div class="d-lg-flex align-items-center">
                              <i class="bi bi-house-fill fs-1 icon-spacing"></i>
                              <div>
                                <p className="fw-bold mb-1">Order</p>
                                <p className="fw-bold mb-0">Arrived</p>
                              </div>
                            </div>
                          </div>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>
                </section>
              ))}
            </>
          );          
    }
//#endregion
  //#region MyListings    
  function MyListings() {
    const { userId } = useAuthToken();
    const [isAddListingVisible, setIsListingVisible] = useState(false);
    const [listings, setListings] = useState([]);
    const [category, setCategory] = useState([]);
    const [newListing, setNewListing] = useState({
      OwnerId: '',
      IsApproved: false,
      Name: '',
      Quantity: '',
      Image: '',
      Specifications: '',
      Description: '',
      Price: '',
      CategoryId: '',
    });
    const [formErrors, setFormErrors] = useState({
      OwnerId: false,
      IsApproved: false,
      Name: false,
      Image: false,
      Specifications: false,
      Description: false,
      Price: false,
      CategoryId: false,
    });
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setNewListing((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        [name]: false,
      }));
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
    
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setNewListing((prevState) => ({
          ...prevState,
          Image: base64Data,
        }));
      };
      reader.readAsDataURL(file);
    };
  
    const toggleListingForm = () => {
      setIsListingVisible(!isAddListingVisible);
    };
  
    useEffect(() => {
      fetchListingsFromDatabase();
      fetchCategories();
    }, [userId]);
  
    const fetchListingsFromDatabase = async () => {
      try {
        const response = await axios.get(`http://localhost:39450/api/Product/getByOwnerId?OwnerId=${userId}`);
        const products = response.data;
        console.log(products);
        setListings(products);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:39450/api/Category/getall');
          if (categoryResponse.status === 200) {
            const categoryData = categoryResponse.data;
            setCategory(categoryData);
          } else {
            console.error('Failed to fetch category data');
          }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const handleFormSubmit = (event) => {
      event.preventDefault();
      
    };

    return (
      <div id="shippingInfo">
        <div id="addressList" style={{ display: isAddListingVisible ? 'none' : 'block' }}>
          <div className="container-userdashboard-tabs">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                padding: '10px',
                width: '90%',
                backgroundColor: '#fff',
                margin: 'auto',
                borderRadius: '10px',
              }}
            >
              <h1 style={{ fontSize: '35px', fontWeight: '400', padding: '5px' }}>My Listings</h1>
              <button className="btn btn-primary me-2" type="button" onClick={toggleListingForm}>
                Add Listing
              </button>
            </div>
            <div className="container rounded bg-white mt-5 mb-5">
              <div className="row" style={{ backgroundColor: '#bdbdbd' }}>
                <div className="col-md-12">
                  <div className="grid-container">
                    {listings.map((listing, index) => (
                      <MDBCard className="text-black" key={index}>
                        <div className="d-flex justify-content-between" style={{ width: '100%', padding: '15px' }}>
                          <p>#{listing.id}</p>
                          <p style={{ color: '#9A9A9A' }}>{listing.dateCreated}</p>
                        </div>
                        <div className="d-flex justify-content-between" style={{ paddingLeft: '15px' }}>
                          <p>Status: {listing.status}</p>
                        </div>
                        <MDBCardImage
                          src={listing.image}
                          position="top"
                          alt="Apple Computer"
                          style={{ maxHeight: '250px', objectFit: 'cover' }}
                        />
                        <MDBCardBody>
                          <div className="text-center">
                            <MDBCardTitle>{listing.title}</MDBCardTitle>
                            <p style={{ color: '#9A9A9A' }}>{listing.description}</p>
                          </div>
                          <div>
                            <div className="d-flex justify-content-between">
                              <span>Orders</span>
                              <span>{listing.orders}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>QTY</span>
                              <span>{listing.qty}</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between total font-weight-bold mt-4">
                            <span>Total</span>
                            <span>${listing.price}</span>
                          </div>
                          <div className="d-flex justify-content-center">
                            <button className="btn btn-primary me-2" type="button" onClick={toggleListingForm}>
                              Edit
                            </button>
                            <button className="btn btn-success me-2" type="button" onClick={toggleListingForm}>
                              Details
                            </button>
                            <button className="btn btn-danger me-2" type="button">
                              Delete
                            </button>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div
          id="add-edit-address"
          style={{ display: isAddListingVisible ? 'block' : 'none' }}
          className="container-userdashboard-tabs"
        >
          <div className="container-userdashboard-tabs">
            <div className="container rounded bg-white mt-5 mb-5">
              <div className="row">
                <div className="col-md-12">
                  <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="text-right">Listing Details</h4>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="productName" className="labels">
                            Product Name
                          </label>
                          <input
                            type="text"
                            id="Name"
                            className="form-control"
                            placeholder="Product Name"
                            name="Name"
                            value={newListing.Name}
                            onChange={handleInputChange}
                        />
                        {formErrors.Name && <p className="text-danger">Product Name is required</p>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="productQuantity" className="labels">
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="Quantity"
                            className="form-control"
                            placeholder="Quantity"
                            name="Quantity"
                            value={newListing.Quantity}
                            onChange={handleInputChange}
                        />
                        {formErrors.Quantity && <p className="text-danger">Quantity is required</p>}
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label htmlFor="productDescription" className="labels">
                        Specifications
                        </label>
                        <textarea 
                          style={{ height: "100px" }} 
                          id="Specifications" 
                          className="form-control" 
                          placeholder="Specifications" 
                          name="Specifications"
                          value={listings.Specifications}
                          onChange={handleInputChange}
                        />
                        {formErrors.Name && <p className="text-danger">Specifications is required</p>}
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="productImages" className="labels">
                            Images
                          </label>
                          <input
                            type="file"
                            id="productImages"
                            className="form-control"
                            multiple
                            onChange={handleImageUpload}
                          />
                          {formErrors.Image && <p className="text-danger">Image is required</p>}
                          {/*  */}
                          <label htmlFor="category" className="labels">Category</label>
                          <select
                          className="form-control"
                          id="CategoryId"
                          name="CategoryId"
                          value={newListing.CategoryId}
                          onChange={handleInputChange}
                          >
                          <option value="">Select Category</option>
                          {category.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                        {formErrors.CategoryId && <p className="text-danger">Category is required</p>}
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="productDescription" className="labels">
                            Description
                          </label>
                          <textarea
                            id="Description" 
                            className="form-control" 
                            placeholder="Product Description" 
                            name="Description"
                            value={newListing.Description}
                            onChange={handleInputChange}
                          />
                          {formErrors.Description && <p className="text-danger">Description is required</p>}
                          <label htmlFor="price" className="labels">
                            Price
                          </label>
                          <input
                            type="text"
                            id="Price"
                            className="form-control"
                            placeholder="Price"
                            name="Price"
                            value={newListing.Price}
                            onChange={handleInputChange}
                        />
                        {formErrors.Price && <p className="text-danger">Price is required</p>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <button className="btn btn-primary me-2" type="submit" onClick={handleFormSubmit}>Save Listing</button>
                      <button className="btn btn-danger" type="button" onClick={toggleListingForm}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  //#endregion
  // #region ChangePassword
  function ChangePassword() {
    const { userId } = useAuthToken();
    const [showPassword, setShowPassword] = useState(false);
    const [changePassword, setChangePassword] = useState({
      OldPassword: '',
      NewPassword: '',
      ConfirmPassword: '',
    });
  
    const [formErrors, setFormErrors] = useState({
      OldPassword: false,
      NewPassword: false,
      ConfirmPassword: false,
    });
  
    const handleShowPasswordChange = () => {
      setShowPassword(!showPassword);
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setChangePassword((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        [name]: false,
      }));
    };
  
    
const handleChangePassword = (event) => {
  event.preventDefault();
  const { OldPassword, NewPassword, ConfirmPassword } = changePassword;

  if (OldPassword === '' || NewPassword === '' || ConfirmPassword === '') {
    setFormErrors({
      OldPassword: OldPassword === '',
      NewPassword: NewPassword === '',
      ConfirmPassword: ConfirmPassword === '',
    });
    return;
  }

  if (NewPassword !== ConfirmPassword) {
    setFormErrors((prevState) => ({
      ...prevState,
      ConfirmPassword: true,
    }));
    return;
  }

  const requestBody = {
    oldPassword: OldPassword,
    newPassword: NewPassword,
  };

  axios
    .post(`http://localhost:39450/api/Auth/changepassword?id=${userId}`, requestBody)
    .then((response) => {
      console.log('Password changed successfully', response.data);
      window.location.href = '/userdashboard';
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        setFormErrors((prevState) => ({
          ...prevState,
          OldPassword: true,
        }));
        console.error('Old password is incorrect');
      } else {
        console.error('Password change failed', error);
      }
    });
};
  
    return (
      <div className="container-userdashboard-tabs">
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">
            <div className="col-md-12 border-right">
              <div className="p-3 py-5">
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="oldPassword" className="labels"> Old Password </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="OldPassword"
                        placeholder="Old Password"
                        className={`form-control ${formErrors.OldPassword ? 'is-invalid' : ''}`}
                        value={changePassword.OldPassword}
                        onChange={handleInputChange}
                      />
                      {formErrors.OldPassword && changePassword.OldPassword === '' && (<div className="invalid-feedback">Old password is required</div>)}
                      {formErrors.OldPassword && changePassword.OldPassword !== '' && (<div className="invalid-feedback">Old password is incorrect</div>)}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="newPassword" className="labels"> New Password </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="NewPassword"
                        placeholder="New Password"
                        className={`form-control ${formErrors.NewPassword ? 'is-invalid' : ''}`}
                        value={changePassword.NewPassword}
                        onChange={handleInputChange}
                      />
                      {formErrors.NewPassword && <div className="invalid-feedback">New Password is required</div>}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="labels"> Confirm New Password </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="ConfirmPassword"
                        placeholder="Confirm New Password"
                        className={`form-control ${formErrors.ConfirmPassword ? 'is-invalid' : ''}`}
                        value={changePassword.ConfirmPassword}
                        onChange={handleInputChange}
                      />
                      {formErrors.ConfirmPassword && changePassword.ConfirmPassword === '' && (<div className="invalid-feedback">Please Confirm your New Password</div>)}
                      {formErrors.ConfirmPassword && changePassword.ConfirmPassword !== '' && (<div className="invalid-feedback">Passwords do NOT match</div>)}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="form-group form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showPassword"
                        checked={showPassword}
                        onChange={handleShowPasswordChange}
                      />
                      <label className="form-check-label" htmlFor="showPassword"> Show Password </label>
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <button className="btn btn-primary me-2" type="button" onClick={handleChangePassword}> Change Password </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

//#endregion




export { PersonalInfo, ShippingInfo, PaymentDetails, MyOrders, MyListings, ChangePassword };

