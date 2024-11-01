import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../../utils/auth.js';
import ErrorMessage  from '../CheckOut/ErrorMessage.js';
import './Register.css';
import DocumentTitle from '../../components/helmet/document_title.js';

function Register() {
  DocumentTitle('Register');

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    retypePassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Retype password is required'),
  });

  return (
    <div className='register'>
      <h2>Register the new account</h2>
      <Formik
        initialValues={{ username: '', email: '', password: '', retypePassword: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.email === values.email);

            if (userExists) {
              alert('User already exists');
              return;
            }

            const newUser = {
              username: values.username,
              email: values.email,
              password: values.password,
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            setToken(values.email); // Use email as a token for simplicity
            navigate('/home');
          } catch (error) {
            console.error('Register error:', error);
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className='register__form'>
              <div>
                <p htmlFor="username">Username</p>
                <Field name="username" type="text" />
              </div>
              <div>
                <p htmlFor="email">E-mail</p>
                <Field name="email" type="email" />
              </div>
              <div>
                <p htmlFor="password">Password</p>
                <Field name="password" type="password" />
              </div>
              <div>
                <p htmlFor="retypePassword">Retype Password</p>
                <Field name="retypePassword" type="password" />
              </div>
              <ErrorMessage errors={errors} touched={touched} onClose={() => {}} />
              <div className='already_regist'>
                <p>Already registered?</p>
                <Link to="/login">Sign in</Link>
              </div>
              <div className='register__button'>
                <button type="submit">Register</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;