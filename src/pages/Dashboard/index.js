import React, {useEffect, useState, useMemo} from 'react';
import {Link} from 'react-router-dom';
import socketio from 'socket.io-client'

import api from '../../services/api';
 
import './styles.css';

export default function Dashboard() {

    const [spots, setSpots ] = useState([]);
    const [imageZoom, setImageZoom ] = useState(null);
    const [styleZoom, setStyleZoom ] = useState('closeImage');
    const [requests, setRequests ] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio('https://d3m-aircnc-backend.herokuapp.com', {
            query: {user_id}
        }), [user_id]);


    useEffect(() => {
        socket.on('booking_request', data => {
            setRequests([...requests, data]);
        });
    }, [requests, socket]);

    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: {user_id}
            });

            setSpots(response.data);
        }

        loadSpots();
    }, []);



    function handleImageZoom(url) {
        setImageZoom(url);
        setStyleZoom('showZoomImg');
    }

    function openZoom() {
        setStyleZoom('closeImage');
    }

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`);
        setRequests(requests.filter(request => request._id != id));
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`);
        setRequests(requests.filter(request => request._id != id));
    }

    return (
        <>  
            <ul  className="notifications">
            {requests.map(request => (
                <li key={request._id}>
                    <p>O usuário <strong>{request.user.email}</strong> solicitou reserva 
                    em <strong>{request.spot.company} </strong>  
                    para a data: <strong>{request.date}</strong> </p>
                    <button className="accept" onClick={() => handleAccept(request._id)} >ACEITAR</button>
                    <button className="reject" onClick={() => handleReject(request._id)}>REJEITAR</button>
                </li>
            ))}
            </ul>
           
            <ul className="spot-list">
                {spots.map(spot => 
                    <li key={spot._id} onClick={() => handleImageZoom(spot.thumbnail_url)}>
                        
                        <header style={{ backgroundImage: `url('${spot.thumbnail_url}')` }}></header>
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R${spot.price}/dia` : 'GRATUITO'}</span>
                    </li>    
                )}
            </ul>

            <Link to="/new">
                    <button className="btn" >
                    Cadastrar novo spot
                    </button>
            </Link>



            <div className={styleZoom} onClick={() => openZoom()}>
                    <img src={imageZoom} alt="Zoom"/>
            </div>  
        </>
        )
}