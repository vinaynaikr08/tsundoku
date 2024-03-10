import { Permission, Role } from "node-appwrite";

export default function userPermissions(user_id: string) {
  return [
    Permission.read(Role.user(user_id)),
    Permission.update(Role.user(user_id)),
    Permission.delete(Role.user(user_id)),
  ];
}
