#!/bin/bash

files_list=(
  ./config/config 
  ./authorization/authorizationGenerator 
  ./bucket/bucketGenerator 
  ./user/userGenerator 
  ./organization/organizationGenerator 
  ./main
  ./testExistence
)

for file in ${files_list[@]}
do
  echo Compiling $file
  tsc $file.ts
done