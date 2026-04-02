import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, student } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient({
      ac,
      roles: {
        admin,
        student,
      },
    }),
    passkeyClient(),
  ],
});
