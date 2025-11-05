import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorFallback = ({
	message = 'Something went wrong',
	onRetry,
}: {
	message?: string;
	onRetry?: () => void;
}) => {
	return (
		<div className="flex flex-col items-center justify-center h-full text-center p-6">
			<AlertTriangle className="w-10 h-10 text-destructive mb-3" />
			<h2 className="text-lg font-semibold mb-1">Error</h2>
			<p className="text-sm text-muted-foreground mb-4">{message}</p>
			{onRetry && (
				<Button variant="outline" onClick={onRetry}>
					Try Again
				</Button>
			)}
		</div>
	);
};

export default ErrorFallback;
