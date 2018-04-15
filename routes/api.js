import express from "express";
import PropertiesReader from "properties-reader";
import path from "path";
import glob from "glob";

function readProperties() {
  let app_root = path.dirname(require.main.filename);
  var properties = PropertiesReader(app_root + "/markdown_archive.config");
  return properties;
}

function listMarkdownFiles(rpath = "") {
  let root_path = rpath;
  if (rpath.length === 0) {
    const config = readProperties();
    root_path = config.get("main.default_path");
  }
  return glob.sync("**/*.md", {
    cwd: root_path,
    absolute: false
  });
}

let list = function(req, res, next) {
  const response = listMarkdownFiles();
  res.json(response);
};

export default {
  list
};
