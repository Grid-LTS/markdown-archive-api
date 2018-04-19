import express from "express";
import PropertiesReader from "properties-reader";
import path from "path";
import glob from "glob";

function readProperties() {
  let app_root = path.dirname(require.main.filename);
  var properties = PropertiesReader(app_root + "/markdown_archive.config");
  return properties;
}

function listMarkdownFiles(root_path = "") {
  if (root_path.length !== 0) {
    return glob.sync("**/*.md", {
      cwd: root_path,
      absolute: false
    });
  } else {
    return [];
  }
}

function getRootPaths() {
  const config = readProperties();
  const root_path = config.get("main.default_path");
  return root_path;
}

let list = function(req, res, next) {
  let response = { type: "mdlist", data: {} };
  response.id = getRootPaths();
  response.data.mdfiles = listMarkdownFiles(response.id);
  res.json(response);
};

export default {
  list
};
