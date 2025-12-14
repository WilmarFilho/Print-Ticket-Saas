import { useSetAtom } from 'jotai';
import { currentPageAtom } from '../../state/atoms';
import { SearchInput } from './SearchInput';
import { PrimaryButton } from './PrimaryButton';
import styles from './PageHeader.module.css';
import { useEffect } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  actionIcon: React.ReactNode;
  actionLabel: string;
  onActionClick: () => void;
  searchPlaceholder: string;
  pageKey: string; // Ex: 'tickets' ou 'clients'
}

export function PageHeader({
  title, description, actionIcon, actionLabel, 
  onActionClick, searchPlaceholder, pageKey
}: PageHeaderProps) {
  
  const setCurrentPage = useSetAtom(currentPageAtom);

  useEffect(() => {
    setCurrentPage(pageKey);
  }, [pageKey, setCurrentPage]);

  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p style={{color: '#64748b', fontSize: '0.9rem'}}>{description}</p>
      </div>
      
      <div className={styles.headerActions}>
        <SearchInput placeholder={searchPlaceholder} />
        
        <PrimaryButton icon={actionIcon} onClick={onActionClick}>
          {actionLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}