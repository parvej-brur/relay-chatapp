"use client";

import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { TextField } from "@/components/ui/TextField";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";
import { useSession } from "@/hooks/useSession";
import type { User } from "@/types/user";
import { useUserSearch } from "../hooks/useUserSearch";
import { SelectedMemberChip } from "./SelectedMemberChip";
import { UserRow } from "./UserRow";
import { UserSearchResults } from "./UserSearchResults";

const MIN_OTHER_MEMBERS = 2;

type NewGroupTabProps = {
  onCreate: (name: string, participantIds: string[]) => Promise<void>;
};

export function NewGroupTab({ onCreate }: NewGroupTabProps) {
  const { user } = useSession();
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const search = useUserSearch(query);

  const results = search.results.filter((result) => result._id !== user?._id);
  const canCreate = name.trim().length > 0 && selected.length >= MIN_OTHER_MEMBERS;

  const toggle = (candidate: User) => {
    setSelected((current) =>
      current.some((member) => member._id === candidate._id)
        ? current.filter((member) => member._id !== candidate._id)
        : [...current, candidate],
    );
  };

  const handleCreate = async () => {
    if (!canCreate) return;
    setSubmitting(true);
    setError(null);
    try {
      await onCreate(
        name.trim(),
        selected.map((member) => member._id),
      );
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Could not create the group.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className="shrink-0 px-6 pt-4">
        <TextField
          label="Group name"
          placeholder="e.g. Design Team"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      {selected.length > 0 ? (
        <div className="flex shrink-0 flex-wrap gap-1.5 px-6 pt-3">
          {selected.map((member) => (
            <SelectedMemberChip
              key={member._id}
              user={member}
              onRemove={(id) => setSelected((current) => current.filter((item) => item._id !== id))}
            />
          ))}
        </div>
      ) : null}

      <div className="shrink-0 px-6 pt-3 pb-2">
        <SearchInput
          placeholder="Add members…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <UserSearchResults
          status={search.status}
          error={search.error}
          results={results}
          query={query}
          idleHint={`Search for at least ${MIN_OTHER_MEMBERS} people to add to the group.`}
          renderRow={(result) => {
            const checked = selected.some((member) => member._id === result._id);
            return (
              <UserRow
                key={result._id}
                user={result}
                subtitle={result.phone}
                onClick={() => toggle(result)}
                trailing={
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md",
                      checked ? "bg-brand text-white" : "border-2 border-line bg-white",
                    )}
                  >
                    {checked ? <FiCheck size={12} strokeWidth={3} aria-hidden="true" /> : null}
                  </span>
                }
              />
            );
          }}
        />
      </div>

      <div className="shrink-0 border-t border-line px-6 py-4">
        {error ? (
          <p role="alert" className="mb-2 text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
        <Button className="w-full" loading={submitting} disabled={!canCreate} onClick={() => void handleCreate()}>
          Create Group
        </Button>
        <p className="mt-2 text-center text-[11px] text-subtle">
          A group needs you plus at least {MIN_OTHER_MEMBERS} other people.
        </p>
      </div>
    </div>
  );
}
