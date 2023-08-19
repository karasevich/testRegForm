import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function Register() {
	const [data, setData] = useState({
		fname: '',
        lname: '',
		email: '',
        phone: '',
		password: '',
        confirmpassword: ''
	})
	const navigate = useNavigate();
    const [error, setError] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
        axios.post('http://localhost:5000/register', data)
		.then(res => {
            if(res.data.Status === 'Success') {
                navigate('/login')
            } else {
                setError(res.data.Error)
            }
		})
		.catch(err => console.log(err));
	}
	return (
        
		<div className='d-flex flex-column justify-content-center align-items-center pt-4 reg-form-body'>
			<h2>Реєстрація</h2>
			<form className="row w-25" onSubmit={handleSubmit}>
			    <div className="col-12">
					<label htmlFor="inputFName" className="form-label">Ім`я</label>
					<input type="text" className="form-input form-control rounded-0" id="inputFName" placeholder='Ім`я' autoComplete='on'
					onChange={e => setData({...data, fname: e.target.value})}/>
				</div>
                <div className="col-12">
					<label htmlFor="inputLName" className="form-label">Прізвище</label>
					<input type="text" className="form-input form-control rounded-0" id="inputLName" placeholder='Прізвище' autoComplete='on'
					onChange={e => setData({...data, lname: e.target.value})}/>
				</div>
				<div className="col-12">
					<label htmlFor="inputEmail4" className="form-label">Email</label>
					<input type="email" className="form-input form-control rounded-0" id="inputEmail4" placeholder='email@example.com' autoComplete='on'
					onChange={e => setData({...data, email: e.target.value})}/>
				</div>
                <div className="col-12">
					<label htmlFor="inputPhone" className="form-label">Номер телефону</label>
					<input type="text" className="form-input form-control rounded-0" id="inputPhone" placeholder='+380' autoComplete='on'
					onChange={e => setData({...data, phone: e.target.value})}/>
				</div>
				<div className="col-12">
					<label htmlFor="inputPassword4" className="form-label">Пароль</label>
					<input type="password" className="form-input form-control rounded-0" id="inputPassword4" placeholder='введіть пароль'
					 onChange={e => setData({...data, password: e.target.value})}/>
				</div>
				<div className="col-12">
					<label htmlFor="inputPassword5" className="form-label">Підтвердження паролю</label>
					<input type="password" className="form-input form-control rounded-0" id="inputPassword5" placeholder='Підтвердіть пароль'
					 onChange={e => setData({...data, confirmpassword: e.target.value})}/>
				</div>
                <div className='text-danger'>
                        {error && error}
                    </div>
				<div className="col-12">
					<button type="submit" className="form-btn btn-warning w-100">Зареєструватись</button>
                    <p className='reg-form-quest'>Вже є акаунт?<a className='noacc-link' href='/login'>Вхід</a></p>
				</div>
			</form>
		</div>

	)
}

export default Register