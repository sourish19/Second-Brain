import { Link2, Tags, FileText, Share2, Search, Smartphone } from 'lucide-react';
import { z } from 'zod';
import type { ReactFormExtendedApi } from '@tanstack/react-form';
import type { UseMutationResult } from '@tanstack/react-query';
// import type { TRegsisterResponse, TLoginResponse, TSignin, TSignup } from '@/validations/authValidation';

export const NavLinksConstants = ['Home', 'Features', 'Pricing', 'Dashboard'];

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

const FieldEnum = z.enum(['Name', 'Email', 'Password']);
const TypeEnum = z.enum(['Sign In', 'Sign Up']);

const AuthFormSchema = z.object({
	title: z.string(),
	description: z.string(),
	fields: z.array(FieldEnum),
	type: TypeEnum,
	action: z.string(),
});

export type AuthFormSchemaType = z.infer<typeof AuthFormSchema>;

export type AuthFormProps<TResponse, TVariables> = AuthFormSchemaType & {
	form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
	mutation: UseMutationResult<TResponse, unknown, TVariables, unknown>;
};
