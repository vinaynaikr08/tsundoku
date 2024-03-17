// Node JS script workaround for gradle on multi-OS
const { execSync } = require("child_process");
const os = require("os");

function runAndroidTest(args) {
  const platform = os.platform();

  let baseCommand = platform === "win32" ? "gradlew.bat" : "./gradlew";

  const command = `${baseCommand} ${args.join(" ")}`;

  try {
    const output = execSync(command, { stdio: "inherit", cwd: "android" });
    if (output && output.toString()) {
      console.log(output.toString());
    }
  } catch (error) {
    console.error(`Error executing command: ${error}`);
    process.exit(1);
  }
}

const args = process.argv.slice(2);

runAndroidTest(args);
