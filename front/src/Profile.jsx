import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Profile() {
    const {id} = useParams();
    const navigate = useNavigate()
    const [profile, setProfile] = useState([])
    useEffect(()=> {
        axios.get('http://localhost:5000/get/'+id)
        .then(res => setProfile(res.data.Result[0]))
        .catch(err => console.log(err));
    })
    const handleLogout = () => {
		axios.get('http://localhost:5000/logout')
		.then(res => {
			navigate('/')
		}).catch(err => console.log(err));
	}
  return (
    <div>
        <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
            <div className="col-lg-8">
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Ім`я:</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{profile.fname}</p>
                            </div>
                        </div>

                        <hr/>
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Прізвище:</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{profile.lname}</p>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Email:</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{profile.email}</p>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-sm-3">
                                <p className="mb-0">Номер телефону:</p>
                            </div>
                            <div className="col-sm-9">
                                <p className="text-muted mb-0">{profile.phone}</p>
                            </div>
                        </div>
                        <hr/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile