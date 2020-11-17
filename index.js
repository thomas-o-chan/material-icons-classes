const fs = require('fs');
const path = require('path');

const basePath = path.resolve('');
const filepath = `${basePath}/node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ijmap`;
const buildPath = `${basePath}/built/material-icons-classes.css`;

/** parse the ijmap and convert each icon object into a css class alias */
function handleFileContents(data) {
  const definitions = JSON.parse(data);
  const classes = [];

  // add a class alias for each icon
  Object.keys(definitions.icons).forEach((definition) => {
    const nameObject = definitions.icons[definition]
    // convert to kebab-case
    let newName = nameObject.name.split(' ').join('-').toLowerCase();
    // catch illegal names
    if (newName.charAt(0).match(/^\d/)) {
      // there are only ever 2-word combos so just reverse the words
      newName = newName.split('-').reverse().join('-');
    }
    classes.push(`.material-icon.${newName}::before {
  content: '\\${definition}';
}
`);
  });
  const css = classes.join('\n');
  fs.writeFile(buildPath, css, () => null);
};

fs.readFile(filepath, 'utf8', (err, result) => {
  if (err) throw err;
  handleFileContents(result);
});