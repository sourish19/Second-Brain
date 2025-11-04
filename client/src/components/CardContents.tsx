import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
import { FileText, Share2, Trash2 } from 'lucide-react';

import type { ContentItem } from '@/validations/contentValidation';

type CardContentsProps = {
	data: ContentItem[];
};

const CardContents = ({ data }: CardContentsProps) => {
	return (
		<div className="flex flex-wrap gap-4">
			{data.map((item) => (
				<Card key={item.id} className="w-[320px] rounded-2xl shadow-sm hover:shadow-md transition">
					<CardHeader className="flex justify-between items-start">
						<div className="flex items-center gap-2">
							<FileText className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								{item.type.toUpperCase()}
							</span>
						</div>
						<div className="flex gap-2 text-muted-foreground">
							<Share2 className="w-4 h-4 cursor-pointer hover:text-primary" />
							<Trash2 className="w-4 h-4 cursor-pointer hover:text-destructive" />
						</div>
					</CardHeader>

					<CardContent>
						<CardTitle className="text-lg font-semibold mb-3">{item.title}</CardTitle>

						{/* Fixed Image Container */}
						<div className="w-full h-40 bg-muted rounded-md overflow-hidden mb-4">
							<img
								src={item.image}
								alt={item.title}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>

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
