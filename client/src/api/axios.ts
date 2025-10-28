import axios from 'axios';

const isProd = import.meta.env.MODE === 'production';

export const axiosInstance = axios.create({
	baseURL: isProd ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_DEV_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});
