import type { CSSProperties, FC } from 'react';
import { cn } from '../lib/utils';

interface LoaderProps {
  className?: string;
  size?: number;
}

interface LoaderStyle extends CSSProperties {
  '--loader-size': string;
}

const Loader: FC<LoaderProps> = ({ className, size = 54 }) => {
  const style: LoaderStyle = { '--loader-size': `${size}px` };

  return (
    <div className={cn('dream-loader', className)} style={style} role="status" aria-label="Loading">
      <span className="dream-loader__ring" aria-hidden="true" />
      <span className="dream-loader__ring dream-loader__ring--inner" aria-hidden="true" />
      <span className="dream-loader__core" aria-hidden="true" />
    </div>
  );
};

export default Loader;
