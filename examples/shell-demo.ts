console.log("Testing Global $ Shell Execution API...");

(async () => {
  const list = await $("ls -l examples");
  console.log("Command stdout:\n" + list.text());

  const version = await $`uname -a`;
  console.log("Kernel Version:", version.text().trim());

  const jsonTest = await $`echo '{"status": "ok", "code": 200}'`;
  console.log("Parsed JSON status:", jsonTest.json().status);
})();
