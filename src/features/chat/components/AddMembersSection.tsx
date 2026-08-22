"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { useUserSearch } from "../hooks/useUserSearch";
import { UserRow } from "./UserRow";
import { UserSearchResults } from "./UserSearchResults";

type AddMembersSectionProps = {
  existingMemberIds: string[];
  onAdd: (userId: string) => void;
};

export function AddMembersSection({ existingMemberIds, onAdd }: AddMembersSectionProps) {
  const [query, setQuery] = useState("");
  const search = useUserSearch(query);

  const results = search.results.filter((result) => !existingMemberIds.includes(result._id));

  return (
    <div className="border-y border-line bg-surface py-3">
      <div className="px-5 pb-1">
        <SearchInput
          autoFocus
          placeholder="Search people to add…"
          className="bg-white"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <UserSearchResults
        status={search.status}
        error={search.error}
        results={results}
        query={query}
        idleHint="Search by name or phone number."
        renderRow={(result) => (
          <UserRow
            key={result._id}
            user={result}
            subtitle={result.phone}
            className="px-5"
            trailing={
              <IconButton
                icon={<FiPlus size={14} />}
                label={`Add ${result.name}`}
                variant="brand"
                className="h-7 w-7"
                onClick={() => onAdd(result._id)}
              />
            }
          />
        )}
      />
    </div>
  );
}
