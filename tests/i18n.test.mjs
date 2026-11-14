import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSpreadsheetTranslation, getTranslations } from '../src/i18n.ts';

test('uses the singular group name for scout labels', () => {
  for (const [title, singular] of [['Verkenners', 'Verkenner'], ['Dolfijnen', 'Dolfijn']]) {
    assert.equal(getSpreadsheetTranslation('nl', 'scout', title), singular);
    assert.equal(getSpreadsheetTranslation('nl', 'editScout', title), `${singular} wijzigen`);
    assert.equal(getSpreadsheetTranslation('en', 'scout', title), singular);
    assert.equal(getSpreadsheetTranslation('en', 'editScout', title), `Edit ${singular}`);
    assert.equal(getSpreadsheetTranslation('nl', 'scouts', title), title);
  }
});

test('recognizes capitalization and surrounding whitespace', () => {
  assert.equal(getSpreadsheetTranslation('nl', 'scout', '  DOLFIJNEN  '), 'Dolfijn');
});

test('keeps the existing labels for other spreadsheet names', () => {
  assert.equal(getSpreadsheetTranslation('nl', 'scout', 'Andere groep'), undefined);
  assert.equal(getSpreadsheetTranslation('nl', 'editScout', 'Andere groep'), undefined);
  assert.equal(getTranslations('nl').scout, 'Verkenner');
});
