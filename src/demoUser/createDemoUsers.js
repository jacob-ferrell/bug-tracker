import uniqid from "uniqid";
import { fetchURL } from "../api";

export default async function createDemoUsers () {
  const demoUsers = ["Admin", "Manager", "Developer", "Tester"].map((role) => ({
    firstName: "Demo",
    lastName: role,
    email: `Demo_${role}@${uniqid()}.com`,
    password: uniqid(),
    demo: true,
  }));

  for (let i in demoUsers) {
    const res = await fetchURL("/signup", demoUsers[i]);
    if (res.failed) return null;

  }
  return demoUsers;
}
