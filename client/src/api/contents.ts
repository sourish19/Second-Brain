import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { axiosInstance } from './axios';
import {
	AddContentResponseSchema,
	GetContentsResponseSchema,
	DeleteContentResponseSchema,
} from '@/validations/contentValidation';

import type {
	AddContentResponse,
	GetContentsResponse,
	AddContentValues,
	DeleteContentValues,
	DeleteContentResponse,
} from '@/validations/contentValidation';

export const getContents = async (): Promise<GetContentsResponse | string> => {
	try {
		const res = await axiosInstance.get<GetContentsResponse>('/get-contents');
		const validData = GetContentsResponseSchema.parse(res.data);
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

export const addContent = async (data: AddContentValues): Promise<AddContentResponse | string> => {
	try {
		const res = await axiosInstance.post<AddContentResponse>('/add-content', data);
		const validData = AddContentResponseSchema.parse(res.data);
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

export const deleteContent = async (
	data: DeleteContentValues,
): Promise<DeleteContentResponse | string> => {
	try {
		const res = await axiosInstance.delete<DeleteContentResponse>('/delete-content', { data });
		const validData = DeleteContentResponseSchema.parse(res.data);
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
