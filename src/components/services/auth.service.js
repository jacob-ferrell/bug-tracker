import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + 'signin', {
                username,
                password
            })
            .then(res => {
                if (res.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return res.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(username, email, password) {
        return axios.post(API_URL + 'signup', {
            username, 
            email,
            password
        });
    }
}

export default new AuthService();