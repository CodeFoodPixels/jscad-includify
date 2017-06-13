module.exports = {
    basePathIncludes: [
        `files/include_one.js`,
        `files/include_two.js`,
        `files/subfolder/subfolder_include.js`,
        `files/subfolder/nested_folder/nested_include.js`
    ],
    code:`(function() {
  (function() {
    include_two = true;
  })();

  include_one = true;
})();

(function() {
  (function() {
    nested_include = true;
  })();

  subfolder_include = true;
})();

index = true;
`,
    includes: [
        `include_one.js`,
        `include_two.js`,
        `subfolder/subfolder_include.js`,
        `subfolder/nested_folder/nested_include.js`
    ]
}
