#!/bin/bash

files_list=(./authorization/authorizationGenerator ./bucket/bucketGenerator ./user/userGenerator ./organization/organizationGenerator ./main)

for file in ${files_list[@]}
do
  echo Compiling $file
  tsc $file.ts
done