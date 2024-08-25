import fs from "node:fs/promises";
import path from "node:path";

const DIR_PATH =  ["./packages/core/usecases", "./packages/react/usecases"];

/**
 * Used to generate the /usecases/root.html file
 */
DIR_PATH.forEach(async (pathValue) => {
  try {
    const files = await fs.readdir(pathValue, { withFileTypes: true });
    const directories = files.filter((file) => file.isDirectory());

    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Directory Index</title>
  <style>
  	li {
  		font-size: 1.5rem;
  	}  
  </style>
</head>
<body>
  <h1>Directory Index</h1>
  <ul>
`;

    for (const dir of directories) {
      htmlContent += `    <li><a href="./${dir.name}/index.html">${prettifyTitle(dir.name)}</a></li>\n`;
    }

    htmlContent += `
  </ul>
</body>
</html>
`;
    await fs.writeFile(path.join(pathValue, "root.html"), htmlContent);
    console.log(pathValue + "root.html has been generated successfully.");
  } catch (err) {
    console.error("Error:", err);
  }
});

function prettifyTitle(input) {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
