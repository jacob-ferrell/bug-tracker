import {useState, useEffect} from 'react';

export function useFetch(url, data = null) {
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [abort, setAbort] = useState(() => {});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const method = data ? 'POST' : 'GET';
                const controller = new AbortController();
                const signal = controller.signal;
                setAbort(controller.abort)
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
                const res = await fetch(url, {...req});
                const json = await res.json();
                setResponse(json);
                setLoading(false);
            } catch (err) {
                setError(error);
            }
        }
        fetchData();
        return () => {
            abort();
        }

    }, [url])

    return { loading, response, error };
}