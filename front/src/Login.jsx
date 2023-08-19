import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Login(props) {

    
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const [error, setError] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/login', values)
        .then(res => {
            if(res.data.Status === 'Success') {
                navigate("/profile");
            } else {
                setError(res.data.Error)
            }
        })
        .catch(err => console.log(err))
    }

    return (

      <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded w-25 border loginForm form'>
            <h2 className='form-title'>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" placeholder='email@example.com' name='email'
                        onChange={e => setValues({ ...values, email: e.target.value })} className='form-input form-control rounded-0' autoComplete='on' />
                </div>
                <div className='mb-3'>
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input type="password" placeholder='Пароль' name='password'
                        onChange={e => setValues({ ...values, password: e.target.value })} className='form-input form-control rounded-0' />
                </div>
                <div className='text-danger'>
                    {error && error}
                </div>
                <p><a className='form-fogot-pass' href='#'>Забули пароль?</a></p>
                <button type='submit' className="form-btn w-100 rounded-2 " id="launch-btn">Увійти</button>
                <p className='noacc-question'>Нема акаунту? <a className='noacc-link' href='/register'>Реєстрація</a></p>
            </form>
        </div>
      </div>
    );
}

export default Login;