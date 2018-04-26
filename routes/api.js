import express from "express";
import PropertiesReader from "properties-reader";
import path from "path";
import glob from "glob";
import fs from "fs";

function readProperties() {
  let app_root = path.dirname(require.main.filename);
  var properties = PropertiesReader(app_root + "/markdown_archive.config");
  return properties;
}

function listFirstDir(fspaths) {
  let dirs = [];
  let files = [];
  fspaths.forEach(fspath => {
    // get first path segment
    const reg = /^[^/]*/;
    let dir = fspath.match(reg)[0];
    const remainder = fspath.replace(reg, "");
    if (!remainder) {
      files.push(dir);
    } else if (dirs.indexOf(dir) === -1) {
      dirs.push(dir);
    }
  });
  return { dirs, files };
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
  let root_paths = root_path_config.split(",").map(fspath => {
    return fspath.trim();
  });
  return root_paths;
}

function createJsonAPIResponse(type, fspaths) {
  let data = [];
  fspaths.forEach(fspath => {
    let absolute_path;
    if (fspath.charAt(0) !== "/") {
      absolute_path = process.env.HOME + "/" + fspath;
    } else {
      absolute_path = fspath;
    }
    data.push({
      id: fspath,
      type,
      attributes: { path: fspath, absolute_path }
    });
  });
  return data;
}

let list = function(req, res, next) {
  // decode %2F for / sign
  // to do build a relationship key
  let root_path = decodeURIComponent(req.params.root_path);
  let response = { data: {} };
  let fspaths = listMarkdownFiles(root_path);
  let listing = listFirstDir(fspaths);
  response.data.id = root_path;
  response.data.type = "mdlist";
  response.data.relationships = {};
  response.included = [];
  response.data.relationships.dirs = {};
  response.data.relationships.dirs.data = [];
  listing.dirs.forEach(dir => {
    let absolute_path = path.join(root_path, dir);
    response.data.relationships.dirs.data.push({
      id: absolute_path,
      type: "mddir"
    });
    response.included.push({
      id: absolute_path,
      type: "mddir",
      attributes: { path: dir, absolute_path }
    });
  });
  response.data.relationships.files = {};
  response.data.relationships.files.data = [];
  listing.files.forEach(file => {
    let absolute_path = path.join(root_path, file);
    response.data.relationships.files.data.push({
      id: absolute_path,
      type: "mdfile"
    });
    response.included.push({
      id: absolute_path,
      type: "mdfile",
      attributes: {
        filename: file,
        absolute_path,
        content: fs.readFileSync(absolute_path, "utf8")
      }
    });
  });
  res.json(response);
};

let mdroots = function(req, res, next) {
  let paths = getRootPaths();
  let response = {};
  response.data = createJsonAPIResponse("mdroot", paths);
  res.json(response);
};

export default {
  list,
  mdroots
};
