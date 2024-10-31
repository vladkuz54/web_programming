import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

function Register() {
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        retypePassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Retype password is required'),
    });

    return (
        <div>
            <h2>Register</h2>
            <Formik
                initialValues={{ username: '', email: '', password: '', retypePassword: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {() => (
                    <Form>
                        <div>
                            <label htmlFor="username">Username</label>
                            <Field name="username" type="text" />
                            <ErrorMessage name="username" component="div" />
                        </div>
                        <div>
                            <label htmlFor="email">E-mail</label>
                            <Field name="email" type="email" />
                            <ErrorMessage name="email" component="div" />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" />
                            <ErrorMessage name="password" component="div" />
                        </div>
                        <div>
                            <label htmlFor="retypePassword">Retype Password</label>
                            <Field name="retypePassword" type="password" />
                            <ErrorMessage name="retypePassword" component="div" />
                        </div>
                        <Link to="/login">Already registered? Sign in</Link>
                        <button type="submit">Register</button>
                    </Form>
                )}
            </Formik>
            
        </div>
    );
};

export default Register;