import React from 'react';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function PrimaryButton({ icon, children, ...rest }: PrimaryButtonProps) {
  return (
    <button className={styles.primaryBtn} {...rest}>
      {icon}
      {children}
    </button>
  );
}