import { cn } from '@/shared/lib/utils';
import { CountIconButton } from './count-icon-button';
import { useState } from 'react';
import toast from 'react-hot-toast';

export interface CountButtonProps {
  value?: number;
  size?: 'sm' | 'lg';
  onClick?: (type: 'plus' | 'minus') => Promise<void> | void;
  className?: string;
  isLoading?: boolean;
}

export const CountButton: React.FC<CountButtonProps> = ({
  className,
  onClick,
  value = 1,
  size = 'sm',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (type: 'plus' | 'minus') => {
    const newValue = type === 'plus' ? localValue + 1 : localValue - 1;
    setLocalValue(newValue);

    if (onClick) {
      setIsLoading(true);
      try {
        await onClick(type);
      } catch (error) {
        setLocalValue(value);
        toast.error('Ошибка при изменении количества:' + error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={cn('inline-flex items-center justify-between gap-3', className)}>
      <CountIconButton
        onClick={() => handleClick('minus')}
        disabled={localValue === 1 || isLoading}
        size={size}
        type="minus"
      />

      <b className={size === 'sm' ? 'text-sm' : 'text-md'}>{localValue}</b>

      <CountIconButton
        onClick={() => handleClick('plus')}
        disabled={isLoading}
        size={size}
        type="plus"
      />
    </div>
  );
};