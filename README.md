qNinja
======
Engineer’s workload management web app built with AngularJS, NodeJS and ExpressJS.

Often times we would have customers with similar issues or we'd need to send a similar email regarding follow-up. Normally, this would be done one at a time in a mail client, but qNinja allows engineers to send the same email message to various customers while still generating a separate email for each one (unique subject and recipients). It includes the necessary tags in the email to be included in the database as well, so it's as if a regular email was sent.

A Novell Engineer navigates to https://qNinja.lab.novell.com and follow these steps:
<ul>
  <li>Enters credentials and selects 'Remember Me' for HTML5 storage of credentials and signature.</li>
  <li>Selects Refresh to pull in data regarding their Service Requests populated in the bottom panel.</li>
  <li>Select several to send emails to (perhaps change the email list, sort columns, etc.)</li>
  <li>Create the Content and Signature of the email. </li>
  Note: Snippets can be selected and inserted from the dropdown
  <li>Select Preview for a dialog that displays what the email will look like.</li>
  <li>Click Send. A notification box is displayed reporting that a request was received by the server and queued up for processing.</li>
</ul>

The server now does these steps:
<ul>
	<li>The server receives the request to send emails, and queues it up for the taskHandler.</li>
	<li>The taskHandler will process 3 of these requests at a time as to not overload the Mail Transport (async library).</li>
	<li>First, all the recipients are validated and any non-emails are discarded.</li>
	<li>A mail item is then created for transport and sent.</li>
	<li>The result of this send (code response of the SMTP server) is appended to the task's report.</li>
	<li>This process is then repeated for all email items that were in the request.</li>
	<li>Then a report is emailed to the Novell User detailing the results.</li>
</ul>
