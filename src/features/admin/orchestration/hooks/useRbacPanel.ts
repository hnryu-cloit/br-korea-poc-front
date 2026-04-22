import { useMemo, useState } from "react";

import { MOCK_RBAC_MEMBERS } from "@/features/admin/orchestration/mockdata/mock-orchestration";
import type { UserRole } from "@/features/admin/orchestration/types/orchestration";

export function useRbacPanel() {
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");

  const filteredMembers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return MOCK_RBAC_MEMBERS.filter((member) => {
      const matchedSearch = q.length === 0 || `${member.name} ${member.email}`.toLowerCase().includes(q);
      const matchedRole = roleFilter === "" || member.role === roleFilter;
      return matchedSearch && matchedRole;
    });
  }, [roleFilter, searchText]);

  return {
    filteredMembers,
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
  };
}
