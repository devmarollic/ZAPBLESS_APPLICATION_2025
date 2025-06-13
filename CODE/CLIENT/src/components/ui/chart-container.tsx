
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

type ChartContainerProps = {
  children: ReactNode;
  config: ChartConfig;
  className?: string;
};

const ChartContainer = ({
  children,
  config,
  className,
  ...props
}: ChartContainerProps) => {
  return (
    <div className={cn('rounded-lg border p-4', className)} {...props}>
      {children}
    </div>
  );
};

export default ChartContainer;
