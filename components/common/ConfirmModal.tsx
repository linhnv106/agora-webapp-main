import React from 'react';

interface Props {
  title: string;
  content: string;
  htmlFor: string;
  onClose: () => void;
  onSubmit: () => void;
}

const ConfirmModal = ({
  title,
  content,
  htmlFor,
  onSubmit,
  onClose,
}: Props) => {
  return (
    <>
      <input type="checkbox" id={htmlFor} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{content}</p>
          <div className="modal-action">
            <label htmlFor={htmlFor} className="btn btn-sm" onClick={onClose}>
              Close!
            </label>
            <label
              htmlFor={htmlFor}
              className="btn btn-sm btn-secondary"
              onClick={onSubmit}
            >
              Ok
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
