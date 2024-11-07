"use client"

import Dashboard from "@/components/Dashboard";
import Main from "@/components/Main";
import Login from "@/components/Login";
import axios from 'axios';
import { useEffect, useState } from "react";


// export const metadata = {
//     title: "REA ⋅ Dashboard",
//   };

export default function DashboardPage(){
    const [users, setUsers]= useState([]);
    // Make a request for a user with a given ID
    useEffect(() => {
        // const result = await axios.get('/api/user');
        // setUsers(result.data);
        axios.get('/api/user').then(result => {
            setUsers(result.data);
        }).catch(e => console.error(e));


        // Login example
        fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'email',
                password: 'password'
            })
        })
    }, []);

    console.log(users);

    const isAuthenticated = false; //just while we design and build
    let children = (
        <Login/> //will render Login inside <Main>  </Main>
    )

    if (isAuthenticated)(
        children = (
            <Dashboard/> //if user is authenticated we can show Dashboard
        )
    )

    return (
        <Main>
            {children}
        </Main>
    )
}