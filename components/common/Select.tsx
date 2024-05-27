import classNames from 'classnames';

interface SelectOption {
  name: string;
  value: any;
}

interface SelectProps {
  name: string;
  label: string;
  type: string;
  value?: any;
  disabled?: boolean;
  options: SelectOption[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  value,
  disabled,
  options,
  onChange,
  error,
}) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>

    <select
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={classNames('select select-bordered w-full', {
        'select-error': error,
      })}
    >
      <option value={undefined}>Pick one</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>

    {error && (
      <label className="label">
        <span className="label-text text-error">{error}</span>
      </label>
    )}
  </div>
);
