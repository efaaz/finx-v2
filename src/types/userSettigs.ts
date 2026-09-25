type PasswordInputProps = {
  id: string;
  label: string;
  placeholder: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;