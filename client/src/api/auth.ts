import { AxiosError } from 'axios';
import type {
	TSignin,
	TSignup,
	TLoginResponse,
	TRegsisterResponse,
} from '@/validations/authValidation';
import { ZodError } from 'zod';
import { axiosInstance } from './axios';

export const loginUser = async (data: TSignin) => {
	try {
		const res = await axiosInstance.post<TLoginResponse>('/users/login', data);
		return res.data;
	} catch (error) {
		if (error instanceof ZodError) console.log('Invalid backend Response ', error.issues);
		else if (error instanceof AxiosError) console.error('Request failed: ', error.message);
	}
};

export const registerUser = async (data: TSignup) => {
	try {
		const res = await axiosInstance.post<TRegsisterResponse>('/users/register', data);
		return res.data;
	} catch (error) {
		if (error instanceof ZodError) console.log('Invalid backend Response ', error.issues);
		else if (error instanceof AxiosError) console.error('Request failed: ', error.message);
	}
};
