import { format } from 'date-fns';
import { ApplicationStatusHistory, STATUS_CONFIG, ApplicationStatus } from '@/lib/types';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusTimelineProps {
  history: ApplicationStatusHistory[];
  currentStatus: ApplicationStatus;
}

const STATUS_ORDER: ApplicationStatus[] = [
  'applied',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'selected',
];

export function StatusTimeline({ history, currentStatus }: StatusTimelineProps) {
  // If rejected, show a special timeline
  if (currentStatus === 'rejected') {
    return (
      <div className="space-y-4">
        {history.map((item, index) => (
          <TimelineItem
            key={item.id}
            status={item.status}
            date={item.created_at}
            note={item.note}
            isLast={index === history.length - 1}
            isCompleted={true}
          />
        ))}
      </div>
    );
  }

  // Get the furthest status reached
  const completedStatuses = history.map(h => h.status);
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      {STATUS_ORDER.map((status, index) => {
        const historyItem = history.find(h => h.status === status);
        const isCompleted = completedStatuses.includes(status);
        const isCurrent = status === currentStatus;
        const isPending = index > currentIndex;

        return (
          <TimelineItem
            key={status}
            status={status}
            date={historyItem?.created_at}
            note={historyItem?.note}
            isLast={index === STATUS_ORDER.length - 1}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            isPending={isPending}
          />
        );
      })}
    </div>
  );
}

interface TimelineItemProps {
  status: ApplicationStatus;
  date?: string;
  note?: string | null;
  isLast: boolean;
  isCompleted: boolean;
  isCurrent?: boolean;
  isPending?: boolean;
}

function TimelineItem({ 
  status, 
  date, 
  note, 
  isLast, 
  isCompleted, 
  isCurrent,
  isPending 
}: TimelineItemProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all',
            isCompleted ? config.bgColor : 'bg-muted',
            isCurrent && 'ring-2 ring-offset-2 ring-primary'
          )}
        >
          {isCompleted ? (
            <Check className={cn('h-4 w-4', config.color)} />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        {!isLast && (
          <div
            className={cn(
              'w-0.5 h-12 mt-2',
              isCompleted && !isPending ? 'bg-primary/30' : 'bg-muted'
            )}
          />
        )}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium',
              isCompleted ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {config.label}
          </span>
          {isCurrent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              Current
            </span>
          )}
        </div>
        {date && (
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(date), 'MMM d, yyyy • h:mm a')}
          </p>
        )}
        {note && (
          <p className="text-sm text-muted-foreground mt-1 italic">
            "{note}"
          </p>
        )}
      </div>
    </div>
  );
}
