import classNames from 'classnames';

interface CheckboxProps {
  name: string;
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  checked,
  onChange,
  error,
}) => (
  <div className="form-control w-fit">
    <label className="cursor-pointer label">
      <input
        name={name}
        type="checkbox"
        className={classNames('checkbox', { 'checkbox-accent': error })}
        checked={checked}
        onChange={onChange}
      />
      <span className="label-text p-4">{label}</span>
    </label>
  </div>
);
