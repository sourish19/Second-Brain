import { create } from 'zustand';

import type { TSideNavbarTypes, TSideNavbarTypesValues } from '@/constants/appConstants';

interface UserStore {
	sideNavigationType: TSideNavbarTypes;
	sideNavigationTypeValue: TSideNavbarTypesValues;
}

export const userStore = create<UserStore>()(() => ({
	sideNavigationType: 'All Contents',
	sideNavigationTypeValue: 'all',
}));

export const setSideNavigationTypeAndValue = (
	type: TSideNavbarTypes,
	value: TSideNavbarTypesValues,
) => userStore.setState({ sideNavigationType: type, sideNavigationTypeValue: value });
