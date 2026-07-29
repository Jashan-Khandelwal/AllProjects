require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");

async function main() {
  const email = "author@blog.test";
  const password = "password123"; // change this before deploying anywhere real
  const hashed = await bcrypt.hash(password, 10);

  const author = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { username: "author", email, password: hashed, role: "AUTHOR" },
  });

  console.log(
    `Seeded author: ${author.email} (id ${author.id}, role ${author.role})`,
  );
  console.log(`Log in with email "${email}" and password "${password}"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
