#!/bin/bash

source .env

export GH_TOKEN=$GH_TOKEN

rm -rf dist/*

npx electron-builder --x64 -m -c.extraMetadata.notarize=true --publish always
