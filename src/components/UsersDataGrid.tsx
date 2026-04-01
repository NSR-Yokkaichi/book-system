"use client";

import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { UserWithRole } from "better-auth/plugins";

export default function UsersDataGrid({ users }: { users: UserWithRole[] }) {
  console.log(users);
  return (
    <DataGrid
      rows={users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }))}
      columns={[
        {
          field: "edit",
          headerName: "Edit",
          width: 100,
          type: "actions",
          renderCell: (row) => (
            <IconButton href={`/admin/users/${row.id}`}>
              <Edit fontSize="small" />
            </IconButton>
          ),
        },
        { field: "id", headerName: "ID", width: 150 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "email", headerName: "Email", width: 250 },
        { field: "role", headerName: "Role", width: 150 },
      ]}
    />
  );
}
