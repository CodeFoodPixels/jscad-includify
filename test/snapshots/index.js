module.exports = {
    includes: [
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
`
}
