import { cn } from '../../lib/utils';

interface AtmosphericWavesProps {
  className?: string;
}

const AtmosphericWaves = ({ className }: AtmosphericWavesProps) => (
  <div aria-hidden="true" className={cn('atmospheric-waves', className)}>
    <span className="atmospheric-wave atmospheric-wave--one" />
    <span className="atmospheric-wave atmospheric-wave--two" />
    <span className="atmospheric-wave atmospheric-wave--three" />
  </div>
);

export default AtmosphericWaves;
