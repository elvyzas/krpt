/**
 * Sukuria registracijos Google Formą ir sujungia ją su Google Sheets lentele.
 *
 * Naudojimas:
 *   1. Atidarykite https://script.google.com ir spauskite „New project“.
 *   2. Įklijuokite šį kodą vietoj esamo.
 *   3. Pasirinkite funkciją `sukurtiFormaIrLentele` ir spauskite „Run“.
 *   4. Suteikite prašomus leidimus (Forms ir Sheets).
 *   5. Nuorodos į formą ir lentelę atsiras žurnale (View → Logs / Execution log).
 */

var FORMOS_PAVADINIMAS = 'Registracija paslaugoms';
var LENTELES_PAVADINIMAS = 'Registracija paslaugoms (atsakymai)';

var PASLAUGOS = [
  'Žirgų terapija',
  'Neuromokykla',
  'Rapid',
  'Stovyklos'
];

function sukurtiFormaIrLentele() {
  var form = FormApp.create(FORMOS_PAVADINIMAS)
    .setDescription('Užpildykite formą ir mes su jumis susisieksime.')
    .setCollectEmail(false)
    .setProgressBar(false)
    .setConfirmationMessage('Ačiū! Jūsų registracija gauta, netrukus su jumis susisieksime.');

  form.addTextItem()
    .setTitle('Vardas, pavardė')
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Kontaktai');

  form.addTextItem()
    .setTitle('Telefonas')
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('Įveskite teisingą telefono numerį, pvz. +370 600 00000')
        .requireTextMatchesPattern('^\\+?[0-9 ()-]{6,20}$')
        .build()
    );

  form.addTextItem()
    .setTitle('El. paštas')
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('Įveskite teisingą el. pašto adresą')
        .requireTextIsEmail()
        .build()
    );

  var paslauga = form.addMultipleChoiceItem()
    .setTitle('Paslauga')
    .setRequired(true);
  paslauga.setChoices(PASLAUGOS.map(function (p) {
    return paslauga.createChoice(p);
  }));

  form.addParagraphTextItem()
    .setTitle('Pastaba')
    .setRequired(false);

  // Sukuriama lentelė ir forma sujungiama su ja: kiekvienas atsakymas
  // automatiškai įrašomas nauja eilute.
  var ss = SpreadsheetApp.create(LENTELES_PAVADINIMAS);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('Formos nuoroda (siųsti klientams): ' + form.getPublishedUrl());
  Logger.log('Formos redagavimas: ' + form.getEditUrl());
  Logger.log('Atsakymų lentelė: ' + ss.getUrl());
}
