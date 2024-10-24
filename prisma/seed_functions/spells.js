import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getSpells() {
  const res = await fetch('https://ffxivcollect.com/api/spells');
  const data = await res.json();
  return data.results;
}

async function createSpell(spell) {
  try {
    let uploadedImageUrl = null;
    if (spell.icon) {
      const fileName = `${spell.id}.${spell.icon.split('.').pop()}`;
      uploadedImageUrl = await uploadImageToSupabase(spell.icon, 'spells', fileName);
    }

    return await db.spell.create({
      data: {
        name: spell.name,
        description: spell.description,
        patch: spell.patch,
        number: spell.order,
        image: uploadedImageUrl ?? spell.icon,
        owned: spell.owned,
        sources: {
          create: spell.sources.map((source) => ({
            type: source.type,
            text: source.text,
          })),
        },
      }
    });
  } catch (error) {
    console.error(`Error creating spell ${spell.name}:`, error);
    return null;
  }
}

export default async function transformSpells() {
  const spells = await getSpells();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < spells.length; i++) {
    const spell = spells[i];
    const result = await createSpell(spell);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${spells.length} spells. Success: ${successCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all spells. Total Success: ${successCount}, Total Failed: ${failCount}`);
}