import { bootstrap } from "./server";

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
