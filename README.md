# Markdown archive api

### Description

This is a web server, written in node, that provides endpoints for filtering and listing of all markdown files within a certain root directory. This server should be used in conjunction with a web-based client, which basically renders and displays the markdown files in the browser. At the moment, one client implementation is available, written in Ember (see project markdown-archive-ember).

## REST API

* conforms to JSON API standard http://jsonapi.org/

### /api/mdroots

* returns all markdown archive root directories as specified in markdown_archive.config

### /api/mdlists/:root_path

* `:root_path` is a urlencoded unix-style file path
* returns a listing of all sub directories (non-recursive) under key `dirs` that contain markdown files and a listing of all markdown files under key `files` for the path `:root_path`
* for files the file content is provided as well

## Installation

1.  Prerequisites
    * install node with version > 8.x
2.  copy markdown_archive.config.dist to markdown_archive.config and customize markdown archives root directories
3.  `npm install`

## Run

* `npm run start`
* server listens on localhost:3000
