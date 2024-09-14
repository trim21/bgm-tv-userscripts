import $ from 'jquery';

function main(): void {
  const params = new URLSearchParams(document.location.search);

  const name = params.get('t.name') ?? '';
  const infobox = params.get('t.infobox') ?? '';
  const summary = params.get('t.summary') ?? '';

  console.log({ name, infobox, summary });
  $('input[name="subject_title"]').val(name);
  $('#subject_infobox').val(infobox);
  $('#subject_summary').val(summary);
}

main();
