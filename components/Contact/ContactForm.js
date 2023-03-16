import {useState, useEffect} from "react";

import classes from './ContactForm.module.css';
import Notification from '../UI/Notification';
import sendContactData from "@/lib/contacts-util";

const ContactForm = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [requestStatus, setRequestStatus] = useState('');
    const [requestError, setRequestError] = useState('');

    useEffect(() => {
        if(requestStatus === 'success' || requestStatus === 'error'){
            const timer = setTimeout(() => {
                setRequestStatus(null);
                setRequestError(null);
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [requestStatus]);

    const onSubmitHandler = async e => {
        e.preventDefault();
        setRequestStatus('pending');
        try {
            await sendContactData({email, name, message});
            setRequestStatus('success');
            setEmail('');
            setName('');
            setMessage('');
        } catch(err){
            setRequestError(err.message);
            setRequestStatus('error');

        }
    };

    let notification;
    if(requestStatus === 'pending'){
        notification = {
            status: 'pending',
            title: 'Sending message...',
            message: 'Your message is on its way!'
        }
    }

    if(requestStatus === 'success'){
        notification = {
            status: 'success',
            title: 'Success!',
            message: 'Message sent successfully!'
        }
    }

    if(requestStatus === 'error'){
        notification = {
            status: 'error',
            title: 'Error!',
             message: requestError
        }
    }

    return (
        <section className={classes.contact}>
            <h1>How could I help you?</h1>
            <form className={classes.form} onSubmit={onSubmitHandler}>
                <div className={classes.controls}>
                    <div className={classes.control}>
                        <label htmlFor="email">Your Email</label>
                        <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className={classes.control}>
                        <label htmlFor="name">Your Name</label>
                        <input type="text" id="name" required value={name} onChange={e => setName(e.target.value)}/>
                    </div>
                </div>
                <div className={classes.control}>
                    <label htmlFor="message">Your Message</label>
                    <textarea id="message" rows="5" required value={message} onChange={e => setMessage(e.target.value)}></textarea>
                </div>
                <div className={classes.actions}>
                    <button>Send Message</button>
                </div>
            </form>
            {notification && <Notification status={notification.status} title={notification.title} message={notification.message}/>}
        </section>
    );
};

export default ContactForm;