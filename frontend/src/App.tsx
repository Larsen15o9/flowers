import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import './App.css';

function App() {
    const fetchData = (): Promise<any[]> => {
        return axios.get('/api').then((response) => response.data);
    };

    const useGroups = () => {
        return useQuery('groups', fetchData);
    };

    const { data } = useGroups();

    return (
        <div className="App">
            <h1>Hello Flowser</h1>
            <p>
                <u>Data from backend</u>: {data}
            </p>
        </div>
    );
}

export default App;
