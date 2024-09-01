import React from 'react';

import {
    EMAIL_RULE,
    PASSWORD_RULE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_RULE_MESSAGE,
    EMAIL_RULE_MESSAGE,
    fieldErrorMessage,
} from 'utilities/validator';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signUpUserAPI } from 'actions/ApiCall';
function SignUp() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmitSignUp = (data) => {
        toast
            .promise(signUpUserAPI(data), {
                pending: 'Signing up...',
            })
            .then((user) => {
                console.log('user: ', user);
                navigate(`/signIn?registeredEmail=${user.email}`);
            });
    };
    return (
        <div>
            <form className="auth__form form__sign-up" onSubmit={handleSubmit(onSubmitSignUp)}>
                <h2 className="auth__form__title">Sign Up</h2>
                <div className="auth__form__input-field">
                    <i className="fa fa-envelope"></i>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        {...register('email', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: EMAIL_RULE,
                                message: EMAIL_RULE_MESSAGE,
                            },
                        })}
                    />
                </div>
                {fieldErrorMessage(errors, 'email')}
                <div className="auth__form__input-field">
                    <i className="fa fa-lock"></i>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        {...register('password', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: PASSWORD_RULE,
                                message: PASSWORD_RULE_MESSAGE,
                            },
                        })}
                    />
                </div>
                {fieldErrorMessage(errors, 'password')}
                <div className="auth__form__input-field">
                    <i className="fa fa-lock"></i>
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Password Confirmation"
                        {...register('password_confirmation', {
                            validate: (value) => {
                                return value === watch('password') || 'Password confirmation does not match.';
                            },
                        })}
                    />
                </div>
                {fieldErrorMessage(errors, 'password_confirmation')}
                {console.log(errors)}

                <button className="auth__form__submit" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUp;
