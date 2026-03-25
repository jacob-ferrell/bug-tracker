import {useState, useEffect} from 'react';

export default function useFetch(url, data = null) {
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const method = data ? 'POST' : 'GET';
        const req = {
            method,
            signal,
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
        }
        if (data) req.body = JSON.stringify(data);
        setLoading(true);
        fetch(url, {...req})
          .then(res => setResponse(res.json()))
          .catch(setError)
          .finally(() => setLoading(false))

        return () => {
            controller.abort();
        }
    }, [url])

    return { loading, response, error };
}