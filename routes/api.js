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
  const root_path_config = config.get("main.default_path");
  let root_paths = root_path_config.split(",").map(path => {
    return path.trim();
  });
  return root_paths;
}

let list = function(req, res, next) {
  response.id = response.data.mdfiles = listMarkdownFiles(response.id);
  res.json(response);
};

let mddirs = function(req, res, next) {
  let paths = getRootPaths();
  let response = {};
  response.data = [];
  paths.forEach(path => {
    response.data.push({ id: path, type: "mddir", attributes: { path } });
  });
  res.json(response);
};

export default {
  list,
  mddirs
};
