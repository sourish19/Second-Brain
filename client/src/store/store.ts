import { create } from 'zustand';
import type { TAuthenticatedUser } from '@/validations/authValidation';
import type { TSideNavbarTypes } from '@/constants/appConstants';

interface UserStore {
	user: TAuthenticatedUser;
	sideNavigationType: TSideNavbarTypes;
}

export const userStore = create<UserStore>()(() => ({
	user: {
		name: '',
		email: '',
	},
	sideNavigationType: 'All Contents',
}));

export const setUser = (data: TAuthenticatedUser) =>
	userStore.setState(() => ({
		user: {
			name: data.name,
			email: data.email,
		},
	}));

export const resetUser = () => userStore.setState({ user: { name: '', email: '' } });

export const setSideNavigationType = (type: TSideNavbarTypes) =>
	userStore.setState({ sideNavigationType: type });
