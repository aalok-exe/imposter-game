import { useState } from 'react';
import type { Category } from '../types';

interface CategoryPickerProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function CategoryPicker({
  categories,
  selectedIds,
  onChange,
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedCount = selectedIds.length;
  const totalCount = categories.length;
  const allOn = selectedCount === totalCount;

  function toggleCategory(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((c) => c !== id)
        : [...selectedIds, id]
    );
  }

  function toggleAll() {
    if (allOn) onChange([]);
    else onChange(categories.map((c) => c.id));
  }

  return (
    <div className={`category-menu-single${open ? ' is-open' : ''}`}>
      <div className="category-menu-single-header">
        <button
          type="button"
          className="category-menu-single-toggle"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="category-menu-single-chevron" aria-hidden="true">
            {open ? '▾' : '▸'}
          </span>
          <span className="category-menu-single-label">Categories</span>
          <span className="category-menu-single-badge">
            {selectedCount}/{totalCount}
          </span>
        </button>
        <label className="category-menu-single-check">
          <input
            type="checkbox"
            checked={allOn}
            onChange={toggleAll}
            aria-label="Toggle all categories"
          />
        </label>
      </div>

      {open && (
        <div className="category-menu-single-body">
          <div className="category-sub-list">
            {categories.map((c) => (
              <label key={c.id} className="category-sub-option">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
