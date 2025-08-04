import { Badge } from '../ui/badge';
//import { STATUS_VARIANTS } from './constants';

type BadgeVariant = 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined;

export const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  Approved: 'secondary',
  Pending: 'default',
  'Under Review': 'outline',
  Rejected: 'destructive',
};

export const getStatusBadge = (status: string) => {
  const variant = STATUS_VARIANTS[status] || 'outline';
  return (
    <Badge variant={variant}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};