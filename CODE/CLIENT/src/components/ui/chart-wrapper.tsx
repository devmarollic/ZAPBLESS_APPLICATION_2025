
import React, { ReactNode } from 'react';

interface ChartWrapperProps {
  children: ReactNode;
}

const ChartWrapper = ({ children }: ChartWrapperProps) => {
  return <>{children}</>;
};

export default ChartWrapper;
