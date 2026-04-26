import { useMemo, useState } from "react";

import { MOCK_RBAC_MEMBERS } from "@/features/admin/orchestration/mockdata/mock-orchestration";
import type { UserRole } from "@/features/admin/orchestration/types/orchestration";

export function useRbacPanel() {
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");

  const filteredMembers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return MOCK_RBAC_MEMBERS.filter((member) => {
      const matchedSearch =
        q.length === 0 || `${member.name} ${member.email}`.toLowerCase().includes(q);
      const matchedRole = roleFilter === "" || member.role === roleFilter;
      return matchedSearch && matchedRole;
    });
  }, [roleFilter, searchText]);

  const roleCounts = useMemo(
    () => ({
      hq_admin: MOCK_RBAC_MEMBERS.filter((member) => member.role === "hq_admin").length,
      store_owner: MOCK_RBAC_MEMBERS.filter((member) => member.role === "store_owner").length,
      ops_partner: MOCK_RBAC_MEMBERS.filter((member) => member.role === "ops_partner").length,
    }),
    [],
  );

  return {
    filteredMembers,
    roleCounts,
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
  };
}
