import React from 'react';
import { Link2, Tags, FileText, Share2, Search, Smartphone } from 'lucide-react';
import { z } from 'zod';
import type { ReactFormExtendedApi } from '@tanstack/react-form';
import type { UseMutationResult } from '@tanstack/react-query';
// import type { TRegsisterResponse, TLoginResponse, TSignin, TSignup } from '@/validations/authValidation';

export const NavLinksConstants = [
	{
		navPath: '/',
		navName: 'Home',
	},
	{
		navPath: '/#features',
		navName: 'Features',
	},
	{
		navPath: '/#pricing',
		navName: 'Pricing',
	},
	{
		navPath: '/dashboard',
		navName: 'Dashboard',
	},
];

export const HeroConstants = {
	title: 'Your Second Brain for the Web',
	description:
		'SecondBrain makes it effortless to keep track of the links you care about. Add titles, tags, and notes, capture link previews automatically, and share your collections with anyone.',
};

export const FeaturesConstants = {
	title: 'Your Links, Smarter',
	description:
		'Save, organize, and share links effortlessly. Capture previews, add tags and notes, and access your SecondBrain from anywhere.',
	feature1: {
		title: 'Save Links Instantly',
		description:
			'Paste any URL and automatically capture the title, image, and metadata to store in your SecondBrain.',
		image: Link2,
	},
	feature2: {
		title: 'Organize with Tags & Categories',
		description:
			'Add custom tags, notes, and categories to keep all your links neatly organized and easy to find.',
		image: Tags,
	},
	feature3: {
		title: 'Smart Preview & Summaries',
		description:
			'Get an instant snapshot of your links with auto-generated previews and summaries for quick reference.',
		image: FileText,
	},
	feature4: {
		title: 'Share Collections',
		description:
			'Easily share your curated links with friends, teammates, or publicly, all with one click.',
		image: Share2,
	},
	feature5: {
		title: 'Search & Filter',
		description:
			'Quickly find any saved link with a powerful search and filter system across your entire collection.',
		image: Search,
	},
	feature6: {
		title: 'Cross-Device Access',
		description:
			'Access your SecondBrain anytime, anywhere—from desktop, tablet, or mobile—so your links are always with you.',
		image: Smartphone,
	},
};

type SidebarNavItem = {
	title: TSideNavbarTypes;
	icon: React.ReactElement;
};

export const SidebarNavbarContents: SidebarNavItem[] = [
	{
		title: 'All Contents',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icons-tabler-outline icon-tabler-note"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M13 20l7 -7" />
				<path d="M13 20v-6a1 1 0 0 1 1 -1h6v-7a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7" />
			</svg>
		),
	},
	{
		title: 'Tweets',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icons-tabler-outline icon-tabler-brand-twitter"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
			</svg>
		),
	},
	{
		title: 'Videos',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icons-tabler-outline icon-tabler-brand-youtube"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z" />
				<path d="M10 9l5 3l-5 3z" />
			</svg>
		),
	},
	{
		title: 'Documents',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icons-tabler-outline icon-tabler-file"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M14 3v4a1 1 0 0 0 1 1h4" />
				<path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
			</svg>
		),
	},
	{
		title: 'Links',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icons-tabler-outline icon-tabler-link"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M9 15l6 -6" />
				<path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
				<path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
			</svg>
		),
	},
	{
		title: 'Tags',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="icon icon-tabler icons-tabler-outline icon-tabler-hash"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M5 9l14 0" />
				<path d="M5 15l14 0" />
				<path d="M11 4l-4 16" />
				<path d="M17 4l-4 16" />
			</svg>
		),
	},
];

export const SideNavbarTypes = [
	'All Contents',
	'Tweets',
	'Videos',
	'Documents',
	'Links',
	'Tags',
] as const;
export const SideNavbarTypesSchema = z.enum(SideNavbarTypes);

const FieldEnum = z.enum(['Name', 'Email', 'Password']);
const TypeEnum = z.enum(['Sign In', 'Sign Up']);

const AuthFormSchema = z.object({
	title: z.string(),
	description: z.string(),
	fields: z.array(FieldEnum),
	type: TypeEnum,
	navigate: z.string(),
	action: z.string(),
});

export type AuthFormSchemaType = z.infer<typeof AuthFormSchema>;

export type AuthFormProps<TResponse, TVariables> = AuthFormSchemaType & {
	form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
	mutation: UseMutationResult<TResponse, unknown, TVariables, unknown>;
};

export type TSideNavbarTypes = z.infer<typeof SideNavbarTypesSchema>;
