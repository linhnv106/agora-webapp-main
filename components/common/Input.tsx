import classNames from 'classnames';

interface CustomInputProps {
  name: string;
  label: string;
  type: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  error,
  ...props
}) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <input
      className={classNames('input input-bordered w-full', {
        'input-error': error,
      })}
      {...props}
    />
    {error && (
      <label className="label">
        <span className="label-text text-error">{error}</span>
      </label>
    )}
  </div>
);
