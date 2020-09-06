import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {request, loading, error, clearError} = useHttp()

    const [form, setForm] = useState({email: '', password: ''})

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
            console.log(data)
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Links</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div style={{marginTop: 18}}>

                        <div className="input-field">
                            <input placeholder="Input email" id="email" type="text" name="email" className="yellow-input" value={form.email} onChange={changeHandler} />
                            <label htmlFor="email">Email</label>
                        </div>

                        <div className="input-field">
                            <input placeholder="Input password" id="password" type="password" name="password" className="yellow-input" value={form.password} onChange={changeHandler} />
                            <label htmlFor="password">Password</label>
                        </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button onClick={loginHandler} className="btn yellow darken-1" style={{marginRight: 10}} disabled={loading}>Sign in</button>
                        <button onClick={registerHandler} className="btn green lighten-1 black-text" disabled={loading}>Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}