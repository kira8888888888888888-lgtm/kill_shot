import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import initAntiDevtools from './antiDevtools';
import { AuthProvider } from './context/AuthContext';
import './index.css';


// Example options: show overlay then redirect to about:blank
// initAntiDevtools({
//   productionOnly: true,
//   showOverlay: true,
//   redirectOnOpen: true,
//   redirectUrl: 'about:blank',
//   redirectDelay: 10
// });


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
