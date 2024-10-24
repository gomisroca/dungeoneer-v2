import transformCards from "./seed_functions/cards";
import transformDungeons from "./seed_functions/dungeons";
import transformMinions from "./seed_functions/minions";
import transformMounts from "./seed_functions/mounts";
import transformOrchs from "./seed_functions/orchestrions";
import transformRaids from "./seed_functions/raids";
import transformSpells from "./seed_functions/spells";
import transformTrials from "./seed_functions/trials";
import transformVariants from "./seed_functions/variant";

async function main() {
  try {
    // await transformMinions();
    // await transformMounts();
    // await transformDungeons();
    // await transformTrials();
    // await transformRaids();
    // await transformVariants();
    // await transformOrchs();
    // await transformSpells();
    await transformCards();
  } catch (e) {
    console.error("An error occurred during the seeding process:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
  