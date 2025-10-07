import fs from "fs";
import path from "path";

export const loadEmailTemplate = (templateName, data) => {
  const filePath = path.join(process.cwd(), "emailtemplate", `${templateName}.html`);
  let template = fs.readFileSync(filePath, "utf8");

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, data[key] || "");
  });

  return template;
};
