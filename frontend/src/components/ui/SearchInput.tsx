import { Search } from 'lucide-react';
import { useAtom } from 'jotai'; 
import { searchTermAtom } from '../../state/atoms';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder = "Buscar..." }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom); 

  return (
    <div className={styles.searchWrapper}>
      <Search className={styles.searchIcon} size={18} />
      <input 
        type="text" 
        className={styles.searchInput} 
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}