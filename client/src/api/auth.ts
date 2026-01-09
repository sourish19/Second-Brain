import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import type {
	TGetUserResponse,
	TLoginResponse,
	TLogoutUserResponse,
	TRegsisterResponse,
	TSignin,
	TSignup,
} from '@/validations/authValidation';
import { AuthResponseSchema, LogoutUserSchema } from '@/validations/authValidation';
import { axiosInstance } from './axios';

export const loginUser = async (data: TSignin): Promise<TLoginResponse | string> => {
	try {
		const res = await axiosInstance.post<TLoginResponse>('/users/login', data);
		const validData = AuthResponseSchema.parse(res.data);
		return validData;
	} catch (error) {
		// Axios error
		if (error instanceof AxiosError) {
			if (error.response) {
				console.error('Request failed:', error.response.data);
				return error.response.data?.message || 'Request failed';
			} else if (error.request) {
				console.error('No response from server', error.response);
				return 'No response from server';
			}
		}
		// Zod error
		else if (error instanceof ZodError) {
			console.log('Invalid backend Response ', error.issues);
			return error.issues[0].message;
			// return error.message;
		}
		// Unknown error
		console.error('Unknown error --> ', error);
		throw error;
		// return 'Unknown error';
	}
};

export const registerUser = async (data: TSignup): Promise<TRegsisterResponse | string> => {
	try {
		const res = await axiosInstance.post<TRegsisterResponse>('/users/register', data);
		const validData = AuthResponseSchema.parse(res.data);
		return validData;
	} catch (error) {
		// Axios error
		if (error instanceof AxiosError) {
			if (error.response) {
				console.error('Request failed:', error.response.data);
				return error.response.data?.message || 'Request failed';
			} else if (error.request) {
				console.error('No response from server', error.response);
				return 'No response from server';
			}
		}
		// Zod error
		else if (error instanceof ZodError) {
			console.log('Invalid backend Response ', error.issues);
			return error.issues[0].message;
			// return error.message;
		}
		// Unknown error
		console.error('Unknown error --> ', error);
		throw error;
		// return 'Unknown error';
	}
};

export const getUser = async (): Promise<TGetUserResponse | undefined> => {
	try {
		const res = await axiosInstance.get<TGetUserResponse>('/users/getme');
		const data = AuthResponseSchema.parse(res.data);
		return data;
	} catch (error) {
		// Axios error
		if (error instanceof AxiosError) {
			if (error.response) {
				console.error('Request failed:', error.response.data);
				throw new Error(error.response.data?.message || 'Request failed');
			} else if (error.request) {
				console.error('No response from server');
				throw new Error('No response from server');
			}
		}
		// Zod error
		else if (error instanceof ZodError) {
			console.log('Invalid backend Response ', error.issues);
			throw error;
			// return error.message;
		}
		// Unknown error
		console.error('Unknown error --> ', error);
		throw error;
		// return 'Unknown error';
	}
};

export const logoutUser = async (): Promise<TLogoutUserResponse | string> => {
	try {
		const res = await axiosInstance.post<TLogoutUserResponse>('/users/logout');
		const validData = LogoutUserSchema.parse(res.data);
		return validData;
	} catch (error) {
		// Axios error
		if (error instanceof AxiosError) {
			if (error.response) {
				console.error('Request failed:', error.response.data);
				throw new Error(error.response.data?.message || 'Request failed');
			} else if (error.request) {
				console.error('No response from server');
				throw new Error('No response from server');
			}
		}
		// Zod error
		else if (error instanceof ZodError) {
			console.log('Invalid backend Response ', error.issues);
			throw error;
			// return error.message;
		}
		// Unknown error
		console.error('Unknown error --> ', error);
		throw error;
		// return 'Unknown error';
	}
};
