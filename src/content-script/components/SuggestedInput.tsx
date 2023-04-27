import { useEffect, useState } from "preact/hooks";
import { Search } from "lucide-preact";
import { JSX } from "preact";

interface Props<T> {
  className: string;
  loadOptions(value: string, onLoad: (loaded: T[]) => void): void;
  onSelect(selected: T): void;
}

export function SuggestedInput<T extends { label: string; value: string }>(props: Props<T>) {
  const { loadOptions, onSelect } = props;

  const [keyword, setKeyword] = useState("");
  const [options, setOptions] = useState<T[]>([]);
  const [currentTimeout, setCurrentTimeout] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (keyword) {
      generateOptions(keyword);
    }
  }, [keyword]);

  function generateOptions(value: string, debounce_timeout = 500) {
    clearTimeout(currentTimeout);

    setCurrentTimeout(
      setTimeout(() => {
        setLoading(true);

        if (value == "") {
          return onOptionLoad([]);
        }

        loadOptions(value, onOptionLoad);
      }, debounce_timeout) as any
    );
  }

  function onOptionLoad(options: T[]) {
    setOptions(options);
    setLoading(false);
    setShowSuggestions(true);
  }

  function onOptionSelected(selected: T) {
    if (onSelect instanceof Function) {
      onSelect({ ...selected });
    }

    setSelected(selected);
    setShowSuggestions(false);
  }

  return (
    <div className="ctnn-suggested-input">
      <Search color="rgba(0, 0, 0, 0.32)" />
      <input
        name="note-keyword"
        className=""
        placeholder="Keyword..."
        value={keyword}
        onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) =>
          setKeyword((e.target as HTMLInputElement).value)
        }
      />
      {options.length > 0 ? (
        <div className={showSuggestions ? "suggestions-list" : "hide"}>
          <div className="suggestion-summary">Found "{keyword}" in:</div>
          {options.map((option) => (
            <div className="suggestion-item" onClick={() => onOptionSelected(option)}>
              {option.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
