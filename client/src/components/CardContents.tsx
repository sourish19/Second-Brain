import { Link } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FileText, Share2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

import { deleteContent } from '@/api/contents';

import type { DeleteContentValues } from '@/validations/contentValidation';
import type { ContentItem } from '@/validations/contentValidation';

type CardContentsProps = {
	data: ContentItem[];
};

const CardContents = ({ data }: CardContentsProps) => {
	const queryClient = useQueryClient();

	// This is for deletion of content 
	const mutation = useMutation({
		mutationFn: async (data: DeleteContentValues) => {
			const response = await deleteContent(data);

			if (response instanceof Object) {
				queryClient.invalidateQueries({ queryKey: ['contents'] });
				toast.success(response.message);
			} else {
				toast.error(response);
			}
			return data;
		},
	});

	return (
		<div className="flex flex-wrap gap-4">
			{data.map((item) => (
				<Card key={item.id} className="w-[300px] rounded-2xl shadow-sm hover:shadow-md transition">
					<CardHeader className="flex justify-between items-start">
						<div className="flex items-center gap-2">
							<FileText className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								{item.type.toUpperCase()}
							</span>
						</div>
						<div className="flex gap-2 text-muted-foreground">
							<Share2 className="w-4 h-4 cursor-pointer hover:text-primary" />
							<Trash2 
							onClick={() => mutation.mutate({contentId: item.id})}
							className="w-4 h-4 cursor-pointer hover:text-destructive" />
						</div>
					</CardHeader>

					<CardContent>
						<Link to={item.link} target="blank">
							{' '}
							<CardTitle className="text-lg font-semibold mb-3">{item.title}</CardTitle>
						</Link>

						{/* Image container */}
						<Link to={item.link} target="blank">
							<div className="w-full h-40 bg-muted rounded-md overflow-hidden mb-4">
								<img
									src={item.image}
									alt={item.title}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							</div>
						</Link>

						{/* Tags */}
						<div className="flex flex-wrap gap-2 mb-2">
							{item.tags.map((tag) => (
								<Badge key={tag} variant="outline">
									#{tag}
								</Badge>
							))}
						</div>

						<p className="text-xs text-muted-foreground">Added on 09/03/2024</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default CardContents;
